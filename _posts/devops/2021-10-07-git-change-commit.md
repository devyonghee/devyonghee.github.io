---
title: git commit author, 시간 변경하는 방법
tags: [git]
categories: devops
---

개발자들은 대부분 깃허브를 이용해서 코드를 관리하고 있다.    
깃허브에서는 해당 사용자가 활발하게 활동하고 있는지 보여주는 잔디밭이 존재한다. 

<!--more-->

하지만 날짜가 지나거나 author 설정을 잘못한 경우 커밋 인식이 안되는 경우가 있다.
평소 이 잔디밭을 가꾸는 사람일수록 이 공백이 굉장히 신경쓰일 수 밖에 없다.

이외에도 다양하게 수정할 이유가 생기게되는데 이러한 경우 다음 과정을 따라해보도록 하자.

변경하기전 커밋 버전 확인이 필요하다. 다음 명령어를 통해 커밋 해시값을 확인한다.

> git log

{% include image.html alt="git-change-commit-log" path="/images/devops/git/git-change-commit-log.png" %}

'edit commit' 이라는 메세지의 커밋을 'second commit' 와 'second commit' 사이의 시간대로 옮기도록 하겠다.
바로 이전 커밋으로 이동할 'second commit' 의 해시값을 복사하고 다음 명령어를 실행한다.

> git rebase -i {해시값}  
> ex) git rebase -i 788d0e1b5e15e3bea58ef23d97af325aad4d84d4

{% include image.html alt="git-change-commit-log" path="/images/devops/git/git-chagne-commit-rebase.png" %}

위 명령어를 입력하면 vi 모드로 들어가게 되는데 변경하고자 하는 커밋에서 `pick`을 `edit` 으로 변경하고 `:wq`로 나간다.





