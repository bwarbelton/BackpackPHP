<?php
require "Slim/Slim.php";

\Slim\Slim::registerAutoloader();

// create new Slim instance
$app = new \Slim\Slim();

$app->get('/', function(){
    echo "Backpack API";
});

$app->get('/children', 'getChildren');
$app->get('/child/:id', 'getChild');
$app->post('/child','postNewChild');
// $app->post('/child/:id', 'postNewChild');
$app->put('/child/:id', 'putChild');
$app->delete('/child/:id', 'deleteChild');

$app->get('/testPage', function() use ($app) {
    $app->render('testpage.php');
});

function getChildren() {
    $request = \Slim\Slim::getInstance()->request();
    $firstName = $request->params('firstName');
    $lastName = $request->params('lastName');
    $child = null;
    if ($firstName == null && $lastName == null) {
        $child = fetchChildren();
    } else {
        $child = fetchChildrenByName($firstName, $lastName);
    }
}

function fetchChildren()
{
    $sql = "select child_id AS childId, punch_card_id AS punchCardId, first_name AS firstName, last_name AS lastName, address, city, state, zip, race, school, backpack, healthCheck, haircut FROM child ORDER BY last_name, first_name";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $children = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        // echo '{"children": ' . json_encode($children) . '}';
        echo json_encode($children);
    } catch (PDOException $e) {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
}

function fetchChildrenByName($firstName, $lastName)
{
    if ($firstName == null) { $firstName = "first name not found"; }
    if ($lastName == null) { $lastName = "last name not found"; }
    $sql = "select child_id AS childId, punch_card_id AS punchCardId, first_name AS firstName, last_name AS lastName, address, city, state, zip, race, school, backpack, healthCheck, haircut FROM child where first_name LIKE :first_name OR last_name LIKE :last_name ORDER BY last_name, first_name";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $firstName = $firstName . '%';
        $lastName = $lastName . '%';
        $stmt->bindParam("first_name", $firstName);
        $stmt->bindParam("last_name", $lastName);
        $stmt->execute();
        $children = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        // echo '{"children": ' . json_encode($children) . '}';
        echo json_encode($children);
    } catch (PDOException $e) {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
}

function getChild($child_id) {
    $child = fetchChild($child_id);
    echo json_encode($child);
}

function fetchChild($child_id) {
    $sql = "select child_id AS childId, punch_card_id AS punchCardId, first_name AS firstName, last_name AS lastName, address, city, state, zip, race, school, backpack, healthCheck, haircut FROM child where child_id =:child_id OR punch_card_id =:punch_card_id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("child_id", $child_id);
        $stmt->bindParam("punch_card_id", $child_id);
        $stmt->execute();
        $child = $stmt->fetchObject();
        $db = null;
        return $child;
    } catch(PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function postNewChild()
{
    $request = \Slim\Slim::getInstance()->request();
    $child = json_decode($request->getBody());
    $whichField = $request->params('insertOnly');
    if ($child->punchCardId != 0 && $child->punchCardId > 0) {
        $existingChild = fetchChild($child->punchCardId);
        if ($existingChild == false) {
            if ($whichField == null) {
                echo json_encode(insertAllFields($child));
            } else {
                echo json_encode(insertOnly($child, $whichField));
            }
        }
    }
}

function insertAllFields($child) {
    $sql = "INSERT INTO child (punch_card_id, first_name, last_name, address, city, state, zip, race, school, backpack, healthCheck, haircut) VALUES (:punch_card_id, :first_name, :last_name, :address, :city, :state, :zip, :race, :school, :backpack, :healthCheck, :haircut)";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("punch_card_id", $child->punchCardId);
        $stmt->bindParam("first_name", $child->firstName);
        $stmt->bindParam("last_name", $child->lastName);
        $stmt->bindParam("address", $child->address);
        $stmt->bindParam("city", $child->city);
        $stmt->bindParam("state", $child->state);
        $stmt->bindParam("zip", $child->zip);
        $stmt->bindParam("race", $child->race);
        $stmt->bindParam("school", $child->school);
        $stmt->bindParam("backpack", $child->backpack);
        $stmt->bindParam("healthCheck", $child->healthCheck);
        $stmt->bindParam("haircut", $child->haircut);
        $stmt->execute();
        $child->childId = $db->lastInsertId();
        $db = null;
        return $child;
    } catch(PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function insertOnly($child, $whichField) {
    // return '{"resp":{"childId":'. $child_id .', "whichField":'. $whichField .'}}';
    switch ($whichField) {
        case "haircut":
            $child->healthCheck = 0;
            $child->backpack = 0;
            $sql = "INSERT INTO child (punch_card_id, $whichField) VALUES (:punch_card_id, $child->haircut)";
            break;
        case "healthCheck":
            $child->haircut = 0;
            $child->backpack = 0;
            $sql = "INSERT INTO child (punch_card_id, $whichField) VALUES (:punch_card_id, $child->healthCheck)";
            break;
        case "backpack":
            $child->haircut = 0;
            $child->healthCheck = 0;
            $sql = "INSERT INTO child (punch_card_id, $whichField) VALUES (:punch_card_id, $child->backpack)";
            break;
    }
    try {
        $child->firstName = null;
        $child->lastName = null;
        $child->address = null;
        $child->city = null;
        $child->state = null;
        $child->zip = null;
        $child->race = null;
        $child->school = null;
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("punch_card_id", $child->punchCardId);
        $stmt->execute();
        $child->childId = $db->lastInsertId();
        $db = null;
        return $child;
    } catch(PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function putChild($child_id)
{
    $existingChild = fetchChild($child_id);
    if ($existingChild != false && $existingChild->punchCardId > 0) {
        $request = \Slim\Slim::getInstance()->request();
        $child = json_decode($request->getBody());
        $whichField = $request->params('updateOnly');
        $child->childId = $existingChild->childId;
        $child->punchCardId = $existingChild->punchCardId;
        if ($whichField == null) {
            echo json_encode(updateAllFields($child_id, $child));
        } else {
            echo json_encode(updateOnly($child_id, $child, $whichField));
        }
    } else {
        echo "Child not found.";
    }
}

function updateAllFields($punch_card_id, $child) {
    $sql = "UPDATE child SET first_name=:first_name, last_name=:last_name, address=:address, city=:city, state=:state, zip=:zip, race=:race, school=:school, backpack=:backpack, healthCheck=:healthCheck, haircut=:haircut WHERE child_id =:child_id OR punch_card_id =:punch_card_id";
    try {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("child_id", $child->childId);
        $stmt->bindParam("punch_card_id", $child->punchCardId);
        $stmt->bindParam("first_name", $child->firstName);
        $stmt->bindParam("last_name", $child->lastName);
        $stmt->bindParam("address", $child->address);
        $stmt->bindParam("city", $child->city);
        $stmt->bindParam("state", $child->state);
        $stmt->bindParam("zip", $child->zip);
        $stmt->bindParam("race", $child->race);
        $stmt->bindParam("school", $child->school);
        $stmt->bindParam("backpack", $child->backpack);
        $stmt->bindParam("healthCheck", $child->healthCheck);
        $stmt->bindParam("haircut", $child->haircut);
        $stmt->execute();
        // $child->childId = $db->lastInsertId();
        $db = null;
        return $child;
    } catch(PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

function updateOnly($child_id, $child, $whichField)
{
    // return '{"resp":{"childId":'. $child_id .', "whichField":'. $whichField .'}}';
    try {
        $existingChild = fetchChild($child_id);
        $child->childId = $existingChild->childId;
        $child->punchCardId = $existingChild->punchCardId;
        $child->firstName = $existingChild->firstName;
        $child->lastName = $existingChild->lastName;
        $child->address = $existingChild->address;
        $child->city = $existingChild->city;
        $child->state = $existingChild->state;
        $child->zip = $existingChild->zip;
        $child->race = $existingChild->race;
        $child->school = $existingChild->school;
        $db = getConnection();
        switch ($whichField) {
            case "haircut":
                $child->healthCheck = $existingChild->healthCheck;
                $child->backpack = $existingChild->backpack;
                $sql = "UPDATE child SET haircut=:haircut WHERE child_id =:child_id OR punch_card_id =:punch_card_id";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("child_id", $child->childId);
                $stmt->bindParam("punch_card_id", $child->punchCardId);
                $stmt->bindParam("haircut", $child->haircut);
                $stmt->execute();
                break;
            case "healthCheck":
                $child->haircut = $existingChild->haircut;
                $child->backpack = $existingChild->backpack;
                $sql = "UPDATE child SET healthCheck=:healthCheck WHERE child_id =:child_id OR punch_card_id =:punch_card_id";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("child_id", $child->childId);
                $stmt->bindParam("punch_card_id", $child->punchCardId);
                $stmt->bindParam("healthCheck", $child->healthCheck);
                $stmt->execute();
                break;
            case "backpack":
                $child->healthCheck = $existingChild->healthCheck;
                $child->haircut = $existingChild->haircut;
                $sql = "UPDATE child SET backpack=:backpack WHERE child_id =:child_id OR punch_card_id =:punch_card_id";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("child_id", $child->childId);
                $stmt->bindParam("punch_card_id", $child->punchCardId);
                $stmt->bindParam("backpack", $child->backpack);
                $stmt->execute();
                break;
        }
        $db = null;
        return $child;
    } catch (PDOException $e) {
        return '{"error":{"text":' . $e->getMessage() . '}}';
    }
}

function deleteChild($child_id) {
    $sql = "DELETE FROM child WHERE child_id=:child_id OR punch_card_id=:child_id";
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
