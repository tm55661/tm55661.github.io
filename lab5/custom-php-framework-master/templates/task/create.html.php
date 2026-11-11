<?php
/** @var \App\Model\Task $task */
/** @var \App\Service\Router $router */

$title = 'Create Task';
$bodyClass = 'create';

ob_start();
?>

<h1>Create Task</h1>

<form method="post"
      action="<?= $router->generatePath('task-create') ?>">

    <label>Title:</label>
    <input type="text" name="task[title]" required>

    <br><br>

    <label>Description:</label>
    <textarea name="task[description]" required></textarea>

    <br><br>

    <button type="submit">Save</button>
</form>

<a href="<?= $router->generatePath('task-index') ?>">
    Back to list
</a>

<?php
$main = ob_get_clean();
include __DIR__ . '/../base.html.php';
?>
