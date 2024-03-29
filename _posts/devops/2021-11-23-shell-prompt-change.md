---
title: '[Linux] shell prompt 변경하기' 
tags: [ubuntu,shell]
categories: devops
---

서버를 다루다보면 현재 어떤 상태에서 작업하고 있는지 파악이 어려운 경우가 생긴다.  
이때, shell prompt 를 본인에게 맞게 설정하면 편리하다.


<!--more-->

시스템에는 사용자들이 사용할 수 있도록 환경 변수가 존재한다. 
이런 변수들 가운데 linux 서버에는 **PS1** 이라는 쉘 변수가 있는데 
이 **PS1** 환경변수를 이용하면 **prompt**의 모양을 변경할 수 있다.

시스템에 따라 다르겠지만 초기에는 굉장히 간단하게 설정되어 있다. (ex. `[ubuntu@ip]`)
`echo $PS1` 명령어로 현재 설정된 환경변수를 확인할 수 있다.

## PS1 변수 기호

PS1 변수에서 사용되는 기호의 의미는 다음과 같다.

- \W     현재 디렉토리의 전체 절대경로명 중 마지막 디렉토리명만을 표시함. 즉 현재디렉토리만 표시함 
- \t     24시간의 단위로 현재시각을 HH:MM:SS 로 표시 
- \T     12시간의 단위로 현재시각을 HH:MM:SS 로 표시 
- \@     12시간의 단위로 현재시각을 오전/오후 로 표시 
- \d     현재 날짜를 나타냄. 요일, 월, 일 형식으로 
- \s     현재 사용중인 쉘의 이름을 나타냄 (C쉘이면 /bin/csh, bash쉘이면 /bin/bash) 
- \w     현재 디렉토리의 전체 절대경로를 모두 표시함 
- \u     사용자명을 표시함 
- \h     서버의 호스트명을 표시함 (www.uzuro.com에서 www 부분) 
- \H     서버의 도메인명을 표시함 (www.uzuro.com에서 uzuro.com 부분) 
- \#     접속한 순간부터 사용한 명령어의 번호를 1번부터 차례대로 표시함 
- \!     사용한 명령어의 history 번호를 표시함 
- \\$    현재 사용자가 root(uid 가 0 )이면 # 을 표시하고 아니면 $ 를 표시함 
- \\     '\' 문자 자체를 표시함 
- \a     ASCII 종소리 문자 (07) 
- \e     ASCII 의 escape 문자 (033) 
- \n     개행문자 (줄바꿈) 
- \v     사용중인 bash 의 버전 
- \V     사용중인 bash 의 배포, 버전+패치수준으로 버전을 상세히 표시함 
- \r     Carrage retrun 
- \nnn   8진수 nnn 에 해당하는 문자


## 변경하기

다음 명령어를 통해 쉘 변수를 변경하면 대체로 **prompt**의 모양을 깔끔하게 변경할 수 있다.

```shell
sudo vi ~/.bashrc
+  SERVER_NAME=name
+  PS1='[\e[1;31m$SERVER_NAME\e[0m][\e[1;32m\t\e[0m][\e[1;33m\u\e[0m@\e[1;36m\h\e[0m \w] \n\$ \[\033[00m\]'

source ~/.bashrc
```

그래도 커스텀 하게 변경을 하고 싶다면 [ezprompt](https://ezprompt.net/) 사이트를 이용해보자.  
비교적 쉽게 변경할 수 있다. 