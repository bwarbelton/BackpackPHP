<?php
require "Slim/Slim.php";

\Slim\Slim::registerAutoloader();

// create new Slim instance
$app = new \Slim\Slim();

$app->get('/children', 'getChildren');
$app->get('/child/:id', 'getChild');
$app->post('/child/:id', 'putChild');
$app->post('/','postNewChild');

$app->get('/', function(){
    echo "Backpack API";
});

$app->get('/testPage', function() use ($app) {
    $app->render('testpage.php');
});

function getChildren() {
    $sql = "select child_id AS childId, first_name AS firstName, last_name AS lastName, backpack, healthCheck, haircut FROM child ORDER BY last_name, first_name";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $children = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        // echo '{"children": ' . json_encode($children) . '}';
        echo json_encode($children);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}


function getChild($child_id) {
    $sql = "select child_id AS childId, first_name AS firstName, last_name AS lastName, backpack, healthCheck, haircut FROM child
            where child_id =child_id";

  //  $stmt->bindParam("child_id", $child_id); 
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $child = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($child);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function putChild($child_id, $backpack) {
    $sql = "update child set backpack = backpack where child_id =child_id";

    //  $stmt->bindParam("child_id", $child_id); 
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $child = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($child);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function postNewChild($child_id) {
    echo "posting new child...";
    //TOD0: read from formToJSON data passed from html -> js
//    $sql = "insert into child  (child_id, firstName, lastName, address, city, state, zip, race)
//            (child_id, firstName, lastName, address, city, state, zip, race)";
    $sql = "insert into child  (child_id, firstName, lastName) values (child_id, firstName, lastName)";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $child = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($child);
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function deleteChild($child_id) {
    $sql = "DELETE FROM child WHERE child_id=:child_id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("child_id", $child_id);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getConnection() {
    $dbhost="localhost:3306";
    $dbuser="root";
    $dbpass="Isfacc3$$!";
    $dbname="backpack";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

$app->run();
