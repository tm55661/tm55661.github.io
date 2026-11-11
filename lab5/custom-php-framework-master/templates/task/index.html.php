<?php
/** @var \App\Model\Task[] $tasks */
/** @var \App\Service\Router $router */

$title = 'Tasks List';
$bodyClass = 'index';

ob_start();
?>

<h1>Tasks List</h1>

<a href="<?= $router->generatePath('task-create') ?>">
    Create new task
</a>

<ul>
    <?php foreach ($tasks as $task): ?>
        <li>
            <strong>
                <?= htmlspecialchars($task->getTitle()) ?>
            </strong>

            <a href="<?= $router->generatePath('task-show', ['id' => $task->getId()]) ?>">
                Details
            </a>

            <a href="<?= $router->generatePath('task-edit', ['id' => $task->getId()]) ?>">
                Edit
            </a>

            <form method="post"
                  action="<?= $router->generatePath('task-delete', ['id' => $task->getId()]) ?>"
                  style="display:inline"
                  onsubmit="return confirm('Delete this task?')">
                <button type="submit">Delete</button>
            </form>
        </li>
    <?php endforeach; ?>
</ul>

<a href="<?= $router->generatePath('post-index') ?>">
    Back to posts
</a>

<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
?>
