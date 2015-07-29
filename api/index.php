<?php
require "Slim/Slim.php";

\Slim\Slim::registerAutoloader();

// create new Slim instance
$app = new \Slim\Slim();

$app->get('/children', 'getChildren');
$app->get('/', function(){
    echo "Backpack API";
});

$app->get('/testPage', function() use ($app) {
    $app->render('testpage.php');
});

function getChildren() {
    $sql = "select * FROM child ORDER BY last_name, first_name";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $children = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo '{"children": ' . json_encode($children) . '}';
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function getConnection() {
    $dbhost="localhost:3306";
    $dbuser="root";
    $dbpass="Isfacc3$$!";
    $dbname="backpackPHP";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

$app->run();
