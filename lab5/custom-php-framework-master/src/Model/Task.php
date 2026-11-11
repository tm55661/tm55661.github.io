<?php
namespace App\Model;

use App\Service\Config;

class Task
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setTitle(?string $title): void
    {
        $this->title = $title;
    }

    public function setDescription(?string $description): void
    {
        $this->description = $description;
    }

    public function fill(array $data): void
    {
        $this->title = $data['title'] ?? '';
        $this->description = $data['description'] ?? '';
    }

    public static function fromArray(array $data): Task
    {
        $task = new Task();
        $task->id = isset($data['id']) ? (int)$data['id'] : null;
        $task->fill($data);
        return $task;
    }

    private static function connect(): \PDO
    {
        return new \PDO(
            Config::get('db_dsn'),
            Config::get('db_user'),
            Config::get('db_pass')
        );
    }

    public static function findAll(): array
    {
        $pdo = self::connect();
        $statement = $pdo->query("SELECT * FROM task ORDER BY id DESC");

        $tasks = [];

        foreach ($statement->fetchAll(\PDO::FETCH_ASSOC) as $row) {
            $tasks[] = self::fromArray($row);
        }

        return $tasks;
    }

    public static function find(int $id): ?Task
    {
        $pdo = self::connect();
        $statement = $pdo->prepare("SELECT * FROM task WHERE id = :id");
        $statement->execute(['id' => $id]);

        $row = $statement->fetch(\PDO::FETCH_ASSOC);

        return $row ? self::fromArray($row) : null;
    }

    public function save(): void
    {
        $pdo = self::connect();

        if ($this->id === null) {
            $statement = $pdo->prepare(
                "INSERT INTO task (title, description)
                 VALUES (:title, :description)"
            );

            $statement->execute([
                'title' => $this->title,
                'description' => $this->description
            ]);

            $this->id = (int)$pdo->lastInsertId();
        } else {
            $statement = $pdo->prepare(
                "UPDATE task SET title = :title,
                 description = :description WHERE id = :id"
            );

            $statement->execute([
                'title' => $this->title,
                'description' => $this->description,
                'id' => $this->id
            ]);
        }
    }

    public function delete(): void
    {
        if ($this->id === null) {
            return;
        }

        $pdo = self::connect();
        $statement = $pdo->prepare(
            "DELETE FROM task WHERE id = :id"
        );

        $statement->execute(['id' => $this->id]);
    }
}
