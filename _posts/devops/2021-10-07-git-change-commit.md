---
title: git commit 사용자 및 날짜 변경하는 방법
tags: [git]
categories: devops
---

많은 개발자들은 깃허브를 이용해서 코드를 관리하고 있다.    
이 깃허브에서는 해당 사용자가 활발하게 활동하고 있는지 보여주는 기능이 있다.

<!--more-->

하지만 실수로 특정 날짜를 지나치거나 author 설정을 잘못한 경우 커밋 인식이 안되는 경우가 있다.
평소 이력을 잘 가꾸는 사람일수록 이 공백이 굉장히 신경쓰일 수 밖에 없다.

꼭 이러한 이유가 아니더라도 다양하게 수정해야 되는 이유가 생기는데 이러한 경우 다음 과정을 따라해보도록 하자.


## 1. 해시값 확인

변경하기전 커밋 버전 확인이 필요하다. 다음 명령어를 통해 커밋 해시값을 확인한다.
```
git log
```

{% include image.html alt="git-change-commit-log" path="/images/devops/git/git-change-commit-log.png" %}

'edit commit' 이라는 메세지의 커밋을 'second commit' 와 'third commit' 사이의 시간대로 옮기도록 하겠다.
바로 이전 커밋으로 이동할 'second commit' 의 해시값을 복사해둔다.

## 2. rebase 

복사해둔 해시값을 통해 다음 명령어를 실행한다.
```
git rebase -i {해시값}  
ex) git rebase -i 788d0e1b5e15e3bea58ef23d97af325aad4d84d4
```

{% include image.html alt="git-change-commit-log" path="/images/devops/git/git-chagne-commit-rebase.png" %}

위 명령어를 입력하면 vi 모드로 들어가게 되는데 변경하고자 하는 커밋에서 `pick`을 `edit` 으로 변경하고 `:wq`로 나간다.


## 3. 수정

{% include image.html alt="git-change-commit-amend" path="/images/devops/git/git-change-commit-amend.png" %}

이 상태에서 `git commit --amend` 을 입력하여 vi 모드에서 수정하거나 아래 명령어를 통해 수정해주도록 한다.
더이상 수정이 필요없다면 `git rebase --continue` 을 입력해준다.


#### 시간 변경  
```
GIT_COMMITTER_DATE="{시간}" git commit --amend --no-edit --date "{시간}"  
ex) GIT_COMMITTER_DATE="Mon Oct 11 02:25:30 2021 +0900" git commit --amend --no-edit --date "Mon Oct 11 02:25:30 2021 +0900"
```

#### author 변경  
```
git commit --amend --author "username <{email}>"  
ex) git commit --amend --author "devyonghee <devyonghee@gmail.com>"
```

정상적으로 수정을 마쳤다면 push 하고 github 에서 확인해본다. 

git commit 변경하는 방법에 대해서 알아보았는데 강제로 시간을 변경하는 것이므로 깃이 꼬일 수 있으니 주의해야 한다.
정말 필요한 경우에만 사용하도록 하자.