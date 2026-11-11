<?php
namespace App\Controller;

use App\Model\Task;
use App\Service\Router;
use App\Service\Templating;
use App\Exception\NotFoundException;

class TaskController
{
    public function indexAction(
        Templating $templating,
        Router $router
    ): ?string {
        $tasks = Task::findAll();

        return $templating->render('task/index.html.php', [
            'tasks' => $tasks,
            'router' => $router
        ]);
    }

    public function showAction(
        int $taskId,
        Templating $templating,
        Router $router
    ): ?string {
        $task = Task::find($taskId);

        if (!$task) {
            throw new NotFoundException("Task not found");
        }

        return $templating->render('task/show.html.php', [
            'task' => $task,
            'router' => $router
        ]);
    }

    public function createAction(
        ?array $requestPost,
        Templating $templating,
        Router $router
    ): ?string {
        $task = new Task();

        if ($requestPost) {
            $task->fill($requestPost);
            $task->save();

            $router->redirect($router->generatePath('task-index'));
            return null;
        }

        return $templating->render('task/create.html.php', [
            'task' => $task,
            'router' => $router
        ]);
    }

    public function editAction(
        int $taskId,
        ?array $requestPost,
        Templating $templating,
        Router $router
    ): ?string {
        $task = Task::find($taskId);

        if (!$task) {
            throw new NotFoundException("Task not found");
        }

        if ($requestPost) {
            $task->fill($requestPost);
            $task->save();

            $router->redirect($router->generatePath('task-index'));
            return null;
        }

        return $templating->render('task/edit.html.php', [
            'task' => $task,
            'router' => $router
        ]);
    }

    public function deleteAction(
        int $taskId,
        Router $router
    ): ?string {
        $task = Task::find($taskId);

        if (!$task) {
            throw new NotFoundException("Task not found");
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $task->delete();
            $router->redirect($router->generatePath('task-index'));
        }

        return null;
    }
}
