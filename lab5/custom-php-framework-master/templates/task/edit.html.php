<?php
/** @var \App\Model\Task $task */
/** @var \App\Service\Router $router */

$title = 'Edit Task';
$bodyClass = 'edit';

ob_start();
?>

<h1>Edit Task</h1>

<form method="post"
      action="<?= $router->generatePath('task-edit', ['id' => $task->getId()]) ?>">

    <label>Title:</label>
    <input type="text"
           name="task[title]"
           value="<?= htmlspecialchars($task->getTitle()) ?>"
           required>

    <br><br>

    <label>Description:</label>
    <textarea name="task[description]" required><?= htmlspecialchars($task->getDescription()) ?></textarea>

    <br><br>

    <button type="submit">Update</button>
</form>

<a href="<?= $router->generatePath('task-index') ?>">
    Back to list
</a>

<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
?>
