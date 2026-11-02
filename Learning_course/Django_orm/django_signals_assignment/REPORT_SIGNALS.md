# Django Signals Report

## Project

The project is in `django_signals_assignment`. The `notifications` app is loaded with `NotificationsConfig`, whose `ready()` method imports `signals.py` once Django initializes the app registry.

## Receivers

| Receiver | Signal | Main arguments | Behavior |
|---|---|---|---|
| `create_post_slug` | `pre_save` | `sender`, `instance` | Creates a slug from `title` only when `slug` is empty. It changes the pending instance and never calls `save()`, so it cannot recurse. |
| `notify_new_user` | `post_save` | `sender`, `instance`, `created` | Calls the dummy welcome notification only when a user is newly created. |
| `backup_deleted_post` | `pre_delete` | `sender`, `instance` | Copies the post fields into `DeletedPost` before the original row is removed. |
| `log_post_deletion` | `post_delete` | `sender`, `instance` | Logs the completed deletion and timestamp. |
| `track_tag_changes` | `m2m_changed` | `instance`, `action`, `pk_set` | Manually connected to the Post-to-Tag through model and logs `pre_add` and `post_remove` actions. |

## Demonstration

Run:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py signals_demo
```

The command creates and updates a post, creates a user, adds and removes a tag, deletes the post, and prints `connection.queries` after every operation.

Representative output:

```text
Created post slug: signal-driven-post
Welcome notification sent to signals@example.com
Updated post slug remains: signal-driven-post
Deleted post 1; backups: 1
```

The test suite verifies that update operations do not resend welcome notifications, slug generation does not recurse, deletion creates a backup, and the many-to-many receiver sees both requested actions.
