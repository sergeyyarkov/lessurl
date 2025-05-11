# LessURL

Service to shortcut your URLs.

## How to install

1. Clone this repository `git clone git@github.com:sergeyyarkov/lessurl.git`.
2. Rename `.env.example` to `.env` and configure your environment variables.
3. You can configure `compose.yml` to change application port or add docker Redis service if you wish.
4. Run the application with `docker compose up -d`

## How to use

You can use web interface or send the `GET` request to `https://service.app/cut` with next query parameters:

- Required `u` - your URL.
- Optional `n` - name for your url.
- Optional `e` - expire time in minutes.

In the response you will get an short URL in text format.
