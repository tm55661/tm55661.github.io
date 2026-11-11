<?php
/** @var \App\Model\Task $task */
/** @var \App\Service\Router $router */

$title = 'Task Details';
$bodyClass = 'show';

ob_start();
?>

<h1><?= htmlspecialchars($task->getTitle()) ?></h1>

<p><?= nl2br(htmlspecialchars($task->getDescription())) ?></p>

<a href="<?= $router->generatePath('task-edit', ['id' => $task->getId()]) ?>">
    Edit
</a>

<a href="<?= $router->generatePath('task-index') ?>">
    Back to list
</a>

<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
?>
