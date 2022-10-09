
# Ngl.Clone Notification Server

I just want to make my own ngl.link, and learn how they works.

## Installation

You need to install NodeJS, and pnpm first! Then

```bash
  git clone https://github.com/hansputera/ngl.link-service
  cd ngl.link-service

  pnpm install
```
    
## Run Locally

Build the source code

```bash
  pnpm run build
```

Run it

```bash
  node dist/index.js
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_ADDRESS` Fill it with ngl.link API url address

`REDIS_URI` Fill it with your redis connection URI


## License

[MIT](https://choosealicense.com/licenses/mit/)

