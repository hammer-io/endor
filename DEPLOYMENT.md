# Deploying the Application

## Steps Overview

1. VM Setup (Ubuntu 16.04)
   1. Update and upgrade: `sudo apt update && sudo apt upgrade`
   2. Install git if it isn't already
   3. [Install docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
   4. [Install nvm / node / npm](http://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/)
      - After installing nvm, install LTS version for node and npm: `nvm install --lts`
      - Check node version with `node --version`
      - Set the default node version (otherwise it won't persist between shells): `nvm alias default <node_version>`
        - Example: `nvm alias default 8.6.0`
   5. [Install mysql-server](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-16-04)
   6. Configure the mysql server
      - Ideally, we want the mysql.cnf files to bind the host address so only
        the docker containers on the server can connect to the database.
        However, for development, we can comment out `skip-networking` and
        `bind-address = 127.0.0.1` to simplify things.
      - Run `mysql --help` and look for the line that looks like this:
        `Default options are read from the following files in the given order: /etc/my.cnf /etc/mysql/my.cnf ~/.my.cnf` 
      - Edit all those files and comment out anywhere it has the `skip-networking`
        or `bind-address` declarations. Also, for any files/directories they import,
        do the same.
      - Grant privileges to root mysql user (either by domain, IP, or subnet):
        - `GRANT ALL PRIVILEGES ON *.* TO 'root'@'%.example.com'
             IDENTIFIED BY 'some_characters'  
             WITH GRANT OPTION;
           FLUSH PRIVILEGES;`
        - `GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.1.%'
             IDENTIFIED BY 'some_characters'  
             WITH GRANT OPTION;
           FLUSH PRIVILEGES;`
   7. Add dockerhost to the `/etc/hosts` file
      - `sudo emacs /etc/hosts`
      - Add the entry `127.0.0.1    dockerhost`
      - This way your production config file (discussed below) will work both
        on the host server and in the docker containers.
   8. [Generate an ssh key](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)
      and add to the project's [deploy keys on Github](https://github.com/blog/2024-read-only-deploy-keys)
2. Project Setup
   1. Navigate to where you want the project, then clone it:
      - `git clone git@github.com:hammer-io/endor.git`
      - (This works via SSH only if you setup a deploy key.)
   2. Install dependencies: `cd endor && npm install`
   3. Create production configuration file:
      - From the endor directory, move to the config directory and copy the default config file: `cd config && cp default.json production.json`
      - Edit `production.json` and enter valid information (database credentials, etc)
      - **NOTE: The database host should be set to 'dockerhost'**
   4. Create and initialize the database:
      - First, run `export NODE_ENV=production` to ensure it uses the production configs
      - Create the database: `npm run createDB`
      - Initialize: `npm run initDB`
3. Setting up docker-gen and Nginx reverse proxy
   1. `docker pull jwilder/nginx-proxy`
   2. `docker run -d -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock jwilder/nginx-proxy`
   3. If you visit the domain(s) without any services running, you should see the 503 page from nginx
   4. For more information, [checkout this article by Thiago Marini](https://tech.mybuilder.com/virtual-hosts-with-docker/#the-solution-docker-gen--nginx-reverse-proxy).
4. Build and run the `hammerio/endor` image

```bash
# Building the image (-t gives a tag name)
docker build -t hammerio/endor .
# Run the image on the defined virtual host
docker run --add-host=dockerhost:$(ip route | awk '/docker0/ { print $NF }') \
  -e NODE_ENV=production \
  -e VIRTUAL_HOST=example.com \
  -d hammerio/endor
```

## Helpful Docker Commands

For the actual docker commands used in deployment, [read above](#steps-overview).

A [docker](https://www.docker.com) image is built to run the application in
production. The following commands will help you deploy Endor in a docker
container on your local machine (for development, normally you don't need
to do this; just run `npm start`):

```bash
# Building the image (-t gives a tag name)
docker build -t hammerio/endor .
# List docker images
docker images
# Runs the image, redirecting port 8888 on your machine to
# the exposed port in the image. The -d flag detaches the process. 
docker run -p 8888:3000 -d hammerio/endor
# Get container ID
docker ps
# Print app output
docker logs <container_id>
# Enter the container, if necessary
docker exec -it <container_id> /bin/sh
# Stop the container
docker stop <container_id>
```

Most of this information was found in
[this guide from nodejs.org](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/).
