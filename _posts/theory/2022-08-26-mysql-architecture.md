---
title: MySQL 아키텍처 자세히 알아보기
tags: [mysql]
categories: theory
---

MySQL 은 관계형 데이터베이스 관리 시스템(DBMS)으로 오픈 소스이다.  
5.5부터 5.7 버전까지는 안정성과 성능 개선에 집중되었다면 8.0 부터는 상용 DBMS가 가지고 있는 기능들이 추가되었다.  
MySQL 의 구조에 대해 자세히 알아본다. 

<!--more-->

## MySQL 엔진 아키텍처

MySQL 구조는 다른 DBMS 에 비해 구조가 독특하다. 이러한 구조 때문에 혜택을 누릴 수도 있고 문제가 될 수도 있다.  

### MySQL 전체 구조

{% include image.html alt="mysql architecture" source_txt='Real MySQL 8.0' path="images/theory/mysql/mysql-architecture.png" %}

MySQL 서버는 크게 MySQL 엔진과 스토리지 엔진으로 구분할 수 있다. 

#### MySQL 엔진

- 커넥션 핸들러 
  - 클라이언트로부터 접속 및 쿼리 요청을 처리
- SQL 파서 및 전처리기
- 옵티마이저
  - 쿼리의 최적화

#### 스토리지 엔진

실제 데이터를 디스크 스토리지에 저장하거나 읽어오는 역할을 전담  
MySQL 은 하나지만 스토리지 엔진은 여러 개를 동시에 사용 가능


### 스레딩 구조

{% include image.html alt="mysql threading architecture" source_txt='Real MySQL 8.0' path="images/theory/mysql/mysql-thread.png" %}

MySQL 는 스레드 기반으로 동작  
다음 명령어로 실행 중인 스레드 확인 가능  
크게 포그라운드(Foreground)와 백그라운드(Background) 스레드로 구분 

```mysql 
SELECT thread_id, name, type, processlist_user, processlist_host
FROM performance_schema.threads
ORDER BY type, thread_id;
```

#### 포그라운드 스레드



#### 백그라운드 스레드

## 참고 자료
