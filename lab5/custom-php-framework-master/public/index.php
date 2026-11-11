<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
switch ($action) {
    case 'post-index':
    case null:
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    case 'task-index':
        $controller = new \App\Controller\TaskController();
        $view = $controller->indexAction($templating, $router);
        break;

    case 'task-show':
        if (empty($_GET['id'])) {
            break;
        }
        $controller = new \App\Controller\TaskController();
        $view = $controller->showAction(
            (int)$_GET['id'], $templating, $router
        );
        break;

    case 'task-create':
        $controller = new \App\Controller\TaskController();
        $view = $controller->createAction(
            $_POST['task'] ?? null, $templating, $router
        );
        break;

    case 'task-edit':
        if (empty($_GET['id'])) {
            break;
        }
        $controller = new \App\Controller\TaskController();
        $view = $controller->editAction(
            (int)$_GET['id'],
            $_POST['task'] ?? null,
            $templating,
            $router
        );
        break;

    case 'task-delete':
        if (empty($_GET['id']) ||
            $_SERVER['REQUEST_METHOD'] !== 'POST') {
            break;
        }
        $controller = new \App\Controller\TaskController();
        $view = $controller->deleteAction(
            (int)$_GET['id'], $router
        );
        break;

    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;
    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}
