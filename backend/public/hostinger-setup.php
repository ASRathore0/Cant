<?php
/**
 * Hostinger Web Maintenance & Artisan Runner for Cant
 * Use this tool to run database migrations, storage symlinks, and cache setup
 * directly from your browser when SSH access is not available.
 *
 * Security: Accessible only with the matching ?secret= query parameter.
 * Change or disable SETUP_SECRET_KEY in your .env file after setup.
 */

// Basic error reporting
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Path to Laravel vendor & bootstrap
$autoloadPath = __DIR__ . '/../vendor/autoload.php';
$appPath = __DIR__ . '/../bootstrap/app.php';

if (!file_exists($autoloadPath) || !file_exists($appPath)) {
    die("Error: Laravel vendor or bootstrap files not found. Ensure composer install has completed.");
}

require $autoloadPath;
$app = require_once $appPath;

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Security token verification
$envSecret = env('SETUP_SECRET_KEY', 'cant_deploy_2026');
$passedSecret = $_GET['secret'] ?? '';

if (empty($passedSecret) || $passedSecret !== $envSecret) {
    http_response_code(403);
    die('<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;background:#0d1117;color:#fff;">
        <h2 style="color:#ef4444;">🔒 403 Forbidden: Invalid Setup Secret</h2>
        <p style="color:#94a3b8;">Pass the secret parameter configured in your .env:<br><code>?secret=YOUR_SETUP_SECRET_KEY</code></p>
    </body></html>');
}

$action = $_GET['action'] ?? null;
$output = '';

if ($action) {
    try {
        switch ($action) {
            case 'migrate':
                Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
                $output = Illuminate\Support\Facades\Artisan::output();
                break;
            case 'seed_admin':
                Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'AdminUserSeeder', '--force' => true]);
                $output = Illuminate\Support\Facades\Artisan::output();
                break;
            case 'seed_canteens':
                Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'CanteenSeeder', '--force' => true]);
                $output = Illuminate\Support\Facades\Artisan::output();
                break;
            case 'storage_link':
                Illuminate\Support\Facades\Artisan::call('storage:link');
                $output = Illuminate\Support\Facades\Artisan::output();
                break;
            case 'optimize':
                Illuminate\Support\Facades\Artisan::call('optimize');
                $output = Illuminate\Support\Facades\Artisan::output();
                break;
            case 'clear_cache':
                Illuminate\Support\Facades\Artisan::call('optimize:clear');
                $output = Illuminate\Support\Facades\Artisan::output();
                break;
            case 'key_generate':
                Illuminate\Support\Facades\Artisan::call('key:generate', ['--show' => true]);
                $output = Illuminate\Support\Facades\Artisan::output();
                break;
            default:
                $output = "Unknown action.";
        }
    } catch (\Throwable $e) {
        $output = "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cant — Hostinger Setup & Artisan Utility</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #062D1F; color: #fff; margin: 0; padding: 30px; }
        .card { max-width: 760px; margin: 0 auto; background: #041F15; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        h1 { font-size: 22px; color: #E8C928; margin-top: 0; display: flex; align-items: center; gap: 10px; }
        p { color: #cbd5e1; font-size: 14px; line-height: 1.5; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin: 24px 0; }
        .btn { display: block; text-align: center; text-decoration: none; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: bold; transition: all 0.2s; border: none; cursor: pointer; }
        .btn-primary { background: #E8C928; color: #062D1F; }
        .btn-primary:hover { background: #facc15; }
        .btn-secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
        .btn-secondary:hover { background: rgba(255,255,255,0.18); }
        .console { background: #000; border-radius: 12px; padding: 16px; font-family: monospace; font-size: 12px; color: #4ade80; white-space: pre-wrap; margin-top: 20px; border: 1px solid #1e293b; max-height: 300px; overflow-y: auto; }
        .tag { font-size: 10px; text-transform: uppercase; background: rgba(232, 201, 40, 0.2); color: #E8C928; padding: 2px 8px; border-radius: 6px; }
        .danger-note { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 12px; font-size: 12px; color: #fca5a5; margin-top: 24px; }
    </style>
</head>
<body>
    <div class="card">
        <h1><span>⚡</span> Cant Hostinger Setup Utility <span class="tag">Production Helper</span></h1>
        <p>Use these 1-click tools to initialize your database migrations and configure storage when deploying to Hostinger Shared / Cloud hosting.</p>

        <div class="grid">
            <a href="?secret=<?= htmlspecialchars($passedSecret) ?>&action=migrate" class="btn btn-primary">
                📦 Run Migrations (migrate --force)
            </a>
            <a href="?secret=<?= htmlspecialchars($passedSecret) ?>&action=storage_link" class="btn btn-secondary">
                🔗 Link Storage (storage:link)
            </a>
            <a href="?secret=<?= htmlspecialchars($passedSecret) ?>&action=seed_admin" class="btn btn-secondary">
                👤 Seed Admin User (admin@...)
            </a>
            <a href="?secret=<?= htmlspecialchars($passedSecret) ?>&action=seed_canteens" class="btn btn-secondary">
                🏪 Seed Default Canteens
            </a>
            <a href="?secret=<?= htmlspecialchars($passedSecret) ?>&action=optimize" class="btn btn-secondary">
                🚀 Cache Config & Routes
            </a>
            <a href="?secret=<?= htmlspecialchars($passedSecret) ?>&action=clear_cache" class="btn btn-secondary">
                🧹 Clear Caches (optimize:clear)
            </a>
        </div>

        <?php if ($action): ?>
            <h3>Console Output: <code><?= htmlspecialchars($action) ?></code></h3>
            <div class="console"><?= htmlspecialchars($output ?: 'Action completed with empty output.') ?></div>
        <?php endif; ?>

        <div class="danger-note">
            🔒 <strong>Security Reminder:</strong> Once initial setup is finished and your database is migrated, you can delete this file (<code>backend/public/hostinger-setup.php</code>) or change <code>SETUP_SECRET_KEY</code> in your Hostinger <code>.env</code> file.
        </div>
    </div>
</body>
</html>
