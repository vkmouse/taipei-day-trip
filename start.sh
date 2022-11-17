sudo docker stop $(sudo docker ps -a -q)
sudo docker rm $(sudo docker ps -a -f status=exited -q)
sudo docker rmi $(sudo docker images -a -q)
sudo docker system prune -f
sudo docker compose up -d
