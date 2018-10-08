<?php

namespace Tests\Feature;

use DB;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

use \Exception;
use \Doctrine\CouchDB\CouchDBClient;
use \Doctrine\CouchDB\HTTP\Response as CouchDBResponse;
use \Doctrine\CouchDB\HTTP\HTTPException as CouchDBHTTPException;

class CouchDbTest extends TestCase
{
    /**
     * The DB connection to CouchDB.
     *
     * @var    \Defenestrator\Laravel5\CouchDb\CouchDbConnection
     * @access private
     */
    private $_connection;

    /**
     * The CouchDBClient object.
     *
     * @var    \Doctrine\CouchDB\CouchDBClient
     * @access private
     */
    private $_client;

    /**
     * A mock of the lap times for a run.
     *
     * @var    array
     * @access private
     */
    private $_dummyLapTimes = [];

    /**
     * A dummy run date
     *
     * @var    string
     * @access private
     */
    private $_dummyRunDate;

    /**
     * The date to search for in testUpdate{LapTimes|RunDate}
     *
     * @var    string
     * @access private
     */
    private $_searchDate = '2018-08-12';

    /**
     * Gets the doc from the query array with date `$date`
     *
     * Takes the docs retrieved by the view query and returns the one doc that's got
     * the date that matches `$date`.
     *
     * @param array  $docs The result of the view query
     * @param string $date The date to search for in `$docs`
     *
     * @return array The singular doc
     * @throws Exception An exception if no doc with `$date` is found
     */
    private function _getDocOfDate(array $docs, string $date)
    {
        $doc = array_filter(
            $docs,
            function ($d) use ($date) {
                return $d['key'] === $date;
            }
        );
        if (empty($doc)) {
            throw new Exception("Doc not found with date $date", 404);
        }
        $doc = $doc[0];
        return [
            'id' => $doc['id'],
            'runDate' => $doc['key'],
            'lapTimes' => $doc['value']
        ];
    }

    /**
     * The setup for this class.
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $this->_connection = DB::connection('couchdb');
        $this->_client = $this->_connection->getCouchDB();
        for ($i = 0; $i < 3; $i++) {
            $r = [];
            array_push($r, rand(1, 99));
            array_push($r, rand(1, 59));
            array_push($r, rand(1, 999));
            array_push($this->_dummyLapTimes, $r);
        }
        $this->_dummyRunDate = sprintf("2018-%02d-%02d", rand(1, 12), rand(1, 12));
    }

    /**
     * Release the CouchDB connection
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->_client);
        unset($this->_connection);
    }

    /**
     * Simple test to see if we've got a CouchDbClient instance.
     *
     * @return void
     */
    public function testHaveCouchDbClientInstance()
    {
        $this->assertInstanceOf(CouchDBClient::class, $this->_client);
    }

    /**
     * Gets all run documents from the database
     *
     * @return array
     */
    public function testGetAllRunDocuments()
    {
        $docs = $this->_client->createViewQuery('runs', 'list')
            ->execute()->toArray();
        $this->assertArrayNotHasKey('error', $docs);
        return $docs;
    }

    /**
     * Tests updating a document's lap times
     *
     * Tests updating a document's lap times after searching for it via run date.
     * This test starts with checks that the `putDocument` method returns the id and
     * the updated rev, as it would if there were no hiccups. It then ends with a
     * new query for the updated doc, and matches its lap times with those listed in
     * this test class.
     *
     * @param array $docs The list of all runs as returned by
     *                    `testGetAllRunDocuments`
     *
     * @see CouchDbTest::testGetAllRunDocuments() For `$docs`
     *
     * @depends testGetAllRunDocuments
     *
     * @return void
     */
    public function testUpdateLapTimes(array $docs)
    {
        $client = $this->_client;
        $doc = $this->_getDocOfDate($docs, $this->_searchDate);
        $rev = $client->findDocument($doc['id'])->body['_rev'];
        $updateData = array_replace($doc, ['lapTimes' => $this->_dummyLapTimes]);
        [$id, $newRev] = $client->putDocument(
            $updateData,
            $doc['id'],
            $rev
        );
        $this->assertEquals($id, $doc['id']);
        $this->assertNotEquals($rev, $newRev);
        $requery = $this->testGetAllRunDocuments();
        $doc = $this->_getDocOfDate($requery, $this->_searchDate);
        $this->assertEquals($this->_dummyLapTimes, $doc['lapTimes']);
    }

    /**
     * Tests updating a document's run date
     *
     * Tests updating a document's run date after searching for it via run date. This
     * test starts with checks that the `putDocument` method returns the id and the
     * updated rev, as it would if there were no hiccups. It then ends with a requery
     * of the updated doc, and checks that its run date matches the one set in this
     * test class.
     *
     * @param array $docs The list of all runs as returned by
     *                    `testGetAllRunDocuments`
     *
     * @see CouchDbTest::testGetAllRunDocuments() For `$docs`
     *
     * @depends testGetAllRunDocuments
     *
     * @return void
     */
    public function testUpdateRunDate(array $docs)
    {
        $client = $this->_client;
        $doc = $this->_getDocOfDate($docs, $this->_searchDate);
        $rev = $client->findDocument($doc['id'])->body['_rev'];
        $updateData = array_replace($doc, ['runDate' => $this->_dummyRunDate]);
        [$id, $newRev] = $client->putDocument(
            $updateData,
            $doc['id'],
            $rev
        );
        $this->assertEquals($id, $doc['id']);
        $this->assertNotEquals($rev, $newRev);
        $requery = $this->testGetAllRunDocuments();
        $doc = $this->_getDocOfDate($requery, $this->_dummyRunDate);
        $this->assertEquals($this->_dummyRunDate, $doc['runDate']);
    }
}
