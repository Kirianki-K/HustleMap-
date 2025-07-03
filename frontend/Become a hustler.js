<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Become a Hustler</title>
    <style>
        body { font-family: sans-serif; background: #fafbfc; margin: 0; padding: 0; }
        .hustler-form-container { max-width: 400px; margin: 40px auto; background: #fff; padding: 32px 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);}
        .hustler-form-container h1 { margin-top: 0; }
        .hustler-form label { display: block; margin-bottom: 16px; }
        .hustler-form input, .hustler-form textarea { width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 4px; }
        .hustler-form button { background: #0078d4; color: #fff; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; }
        .hustler-form-success { max-width: 400px; margin: 40px auto; background: #e6ffed; padding: 32px 24px; border-radius: 8px; text-align: center;}
    </style>
    <script>
        function handleSubmit(e) {
            e.preventDefault();
            document.getElementById('hustler-form').style.display = 'none';
            document.getElementById('hustler-success').style.display = 'block';
        }
    </script>
</head>
<body>
    <div class="hustler-form-container">
        <h1>Become a Hustler</h1>
        <p>Join HustleMap+ and connect with a community of doers, makers, and side-hustlers.</p>
        <form class="hustler-form" id="hustler-form" onsubmit="handleSubmit(event)">
            <label>
                Name
                <input type="text" name="name" required placeholder="Your full name" />
            </label>
            <label>
                Email
                <input type="email" name="email" required placeholder="you@email.com" />
            </label>
            <label>
                Location
                <input type="text" name="location" required placeholder="City, Country" />
            </label>
            <label>
                Skills / Hustles
                <input type="text" name="skills" required placeholder="e.g. Graphic Design, Tutoring, Coding" />
            </label>
            <label>
                Short Bio
                <textarea name="bio" required placeholder="Tell us about your hustle journey..." rows="4"></textarea>
            </label>
            <button type="submit">Apply Now</button>
        </form>
        <div id="hustler-success" class="hustler-form-success" style="display:none;">
            <h2>Thank you for joining HustleMap+</h2>
            <p>We’ve received your application. We’ll be in touch soon!</p>
        </div>
    </div>
</body>
</html>