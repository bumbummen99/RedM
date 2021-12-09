#!/bin/bash
# Create a systemd service that autostarts & manages a docker-compose instance in the current directory
# by Uli Köhler - https://techoverflow.net
echo "Creating systemd service as /etc/systemd/system/redm.service"
# Create systemd service file
sudo cat >/etc/systemd/system/redm.service <<EOF
[Unit]
Description=RedM
Requires=docker.service
After=docker.service
[Service]
Restart=always
User=root
Group=docker
WorkingDirectory=$(pwd)
# Shutdown container (if running) when unit is started
ExecStartPre=$(which docker-compose) -f docker-compose.yml down
# Start container when unit is started
ExecStart=$(which docker-compose) -f docker-compose.yml up
# Stop container when unit is stopped
ExecStop=$(which docker-compose) -f docker-compose.yml down
[Install]
WantedBy=multi-user.target
EOF
echo "Enabling & starting redm"
# Autostart systemd service
sudo systemctl enable redm.service
# Start systemd service now
sudo systemctl start redm.service
