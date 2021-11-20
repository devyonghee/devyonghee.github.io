---
title: Docker / Docker-compose 설치하기 (ubuntu)
tags: [ubuntu,docker]
categories: devops
---

ubuntu 에서 docker 와 docker-compose 설치하는 방법에 대해 알아본다.

<!--more-->

apt 패키지 관리자를 이용하여 docker 를 설치한다.  


### 1. 설치하기 전 준비  
- 이전 버전 도커 삭제  
  ```shell
  sudo apt-get remove docker docker-engine docker.io containerd runc
  ```
  
- 패키지 업데이트  
  ```shell
  sudo apt-get update
  ```
<br/>

### 2. docker 관련 패키지 설치  
y 옵션은 어떤 질문이 나오면 항상 y를 입력해주기 위해 추가했다. 
```shell
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
``` 
<br/>   

### 3. GPG key 추가
```shell
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - 
```

키가 추가되었는지 확인하려면
```shell
sudo apt-key fingerprint 0EBFCD88
```
<br/>

### 4. docker repository 추가
```shell
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
```
<br/>

### 5. docker 엔진 설치
```shell
apt-get install -y docker-ce
```
<br/>

### 6. docker 그룹 추가  
```shell
sudo usermod -aG docker $(whoami)
newgrp docker
```
<br/>

### 7. docker-compose 설치
```shell
sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

<br/>

### 다음 명령어로 한번에 설치하자
   
```shell
sudo apt-get update && \
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common && \
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - && \
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" && \
sudo apt-get update && \
sudo apt-get install -y docker-ce && \
sudo usermod -aG docker $(whoami) && \
newgrp docker  && \
sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
sudo chmod +x /usr/local/bin/docker-compose && \
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

