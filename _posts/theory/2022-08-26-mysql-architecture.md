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

#### 포그라운드 스레드 (Foreground Thread)

- 최소한 MySQL 서버에 접속된 클라이언트의 수만큼 존재 (요청하는 쿼리 문장 처리)
  - 커넥션이 종료되면 담당하던 스레드는 스레드 캐시(Thread cache)로 되돌아감
  - 스레드 캐시에 일정 개수 이상의 스레드가 대기 중이라면 종료시켜 일정 개수만 유지 (`thread_cache_size` 변수로 설정)
- 데이터를 데이터 버퍼나 캐시에서 가져옴
  - 없으면 직접 디스크의 데이터나 인덱스 파일로부터 읽어와서 처리
  - MyISAM 테이블: 디스크 쓰기 작업까지 포그라운드 스레드가 처리
  - InnoDB 테이블: 데이터 버퍼나 캐시까지만 포그라운드 스레드가 처리 (디스크까지 기록하는 작업은 백그라운드 스레드)

#### 백그라운드 스레드 (Background Thread)

InnoDB 의 백그라운드에서 처리되는 작업

- 인서트 버퍼(Insert Buffer)를 병합하는 스레드
- 로그를 디스크로 기록하는 스레드
- InnoDB 버퍼 풀의 데이터를 디스크에 기록하는 스레드
  - 쓰기 작업을 버퍼링해서 일괄 처리하는 기능 탑재 (MyISAM 의 경우 사용자 스레드에서 함께 처리)
- 데이터를 버퍼로 읽어오는 스레드
- 잠금이나 데드락을 모니터링하는 스레드



## 참고 자료
