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

### 메모리 할당 및 사용 구조

{% include image.html alt="mysql memory" source_txt='Real MySQL 8.0' path="images/theory/mysql/mysql-memory.png" %}

MySQL 에서 사용되는 메모리 공간은 크게 메모리 영역과 로컬 메모리 영역으로 구분된다.  

#### 글로벌 메모리 영역

클라이언트 스레드의 수와 무관하게 하나의 메모리 공간만 할당한다. (필요에 따라 2개 이상도 가능)  
모든 스레드에 의해 공유

- 테이블 캐시
- InnoDB 버퍼 풀
- InnoDB 어댑티브 해시 인덱스
- InnoDB 리두 로그 버퍼

#### 로컬 메모리 영역

세션 메모리 영역이라고도 하며 클라이언트 스레드가 쿼리를 처리하는 데 사용되는 영역  
클라이언트 커넥션을 처리하기 위한 스레드에서 사용하는 메모리 공간(독립적으로 할당)

- 정렬 버퍼(Sort Buffer)
- 조인 버퍼
- 바이너리 로그 캐시
- 네트워크 버퍼


### 쿼리 실행 구조

{% include image.html alt="쿼리 실행 구조" source_txt='Real MySQL 8.0' path="images/theory/mysql/mysql-query-execution.png" %}

#### 쿼리 파서

- 사용자 요청으로 들어온 쿼리 문장을 토큰으로 분리하여 트리 형태의 구조로 형성
- 기본 문법 오류 발견하고 사용자에게 오류메세지 전달

#### 전처리기

- 파서 트리를 기반으로 쿼리 문장에 구조적인 문제 검증
  - 테이블 이름, 칼럼 이름, 객체 존재 여부, 접근 권한 등 검증 

#### 옵티마이저

- 저렴한 비용으로 빠르게 처리하는 방법을 결정하는 역할 (DBMS 의 두뇌 역할)
  - 중요한 역할이며 영향 범위 또한 넓음

#### 실행엔진

- 만들어진 계획대로 핸들러에게 요청해서 받은 결과를 또 다른 핸들러 요청의 입력으로 연결하는 역할

GROUP BY 처리를 위해 임시 테이블을 사용하는 실행 엔진 예시
1. 실행 엔진이 핸들러에게 임시 테이블을 만들라고 요청
2. 실행 엔진은 WHERE 절에 일치하는 레코드를 읽어오라고 핸들러에게 요청
3. 읽어온 레코드들을 1번에서 준비한 임시 테이블로 저장하라고 다시 핸들러에게 요청
4. 데이터가 준비된 임시 테이블에서 필요한 방식으로 데이터를 읽어오라고 핸들러에게 요청
5. 결과를 사용자나 다른 모듈로 넘김


#### 핸들러 (스토리지 엔진)

- 데이터를 디스크로 저장하고 읽어오는 역할


## InnoDB 스토리지 엔진 아키텍처

{% include image.html alt="innoDB storage engine architecture" source_txt='Real MySQL 8.0' path="images/theory/mysql/innodb-engine-architecture.png" %}

### 프라이머리 키에 의한 클러스터링

- InnoDB 의 모든 테이블은 기본적으로 프라이머리 키를 기준으로 순서대로 클러스터링되어 저장   
- 세컨더리 인덱스는 레코드의 주소대신 프라이머리 키의 값을 주소로 이용
  - 다른 보조 인덱스에 비해 비중이 높음

### 외래 키 지원

- InnoDB 스토리지 엔진 레벨에서 외래 키에 대해 지원 (MyISAM, MEMORY 는 불가능)
- 외래 키로 인해 잠금이 여러 테이블로 전파되고 데드락이 발생될 수 있기 때문에 주의
  - `SET foreign_key_check` 로 활성 여부 선택 가능

### MVCC(Multi Version Concurrency Control)

- 레코드 레벨의 트랜잭션을 지원하는 DBMS 기능
- 주로 잠금을 사용하지 않는 일관된 읽기를 제공하기 위해 사용
- `UPDATE` 문장이 실행되면 커밋 실행 여부와 관계없이 버퍼 풀은 새로운 값으로 변경
  - 디스크의 데이터 파일에는 백그라운드 스레드에 의해 업데이트 됐을 수도 있고 아닐 수도 있음
- 격리 수준에 따라 버퍼 풀이나 데이터 파일에서 읽어올지, 언두 영역에서 읽어올지 다름
- 롤백하면 언두 영역에 있는 데이터를 버퍼 풀로 복구하고 언두 영역의 내용을 삭제
- 커밋되면 언두 영역이 바로 삭제되지 않고 트랜잭션이 없을 때 백업 데이터가 삭제 됨

### 잠금 없는 일관된 읽기(Non-Locking Consistent Read)

- InnoDB 스토리지 엔진은 MVCC 기술로 잠금을 걸지 않고 읽기 작업 수행 (잠금 없는 일관된 읽기)
  - 다른 트랜잭션의 잠금을 기다리지 않고 읽기 가능
- 격리 수준이 `SERIALIZABLE` 아니라면 읽기 작업은 작믐을 대기하지 않고 바로 실행

### 자동 데드락 감지

- InnoDB 스토리지 엔진은 잠금이 교착 상태를 체크하기 위해 잠금 대기 목록을 그래프(Wait-for List) 형태로 관리
- 데드락 감지 스레드가 있어서 잠금 대기 그래프를 검사해 교착 상태의 트랜잭션을 찾아 그 중 하나를 강제 종료
  - 언두 로그 레코드가 더 적은 트랜잭션을 강제 종료 (처리할 내용, 부하가 적음)
- 동시 처리 스레드가 많거나 잠금의 개수가 많아지면 데드락 감지 스레드가 느려짐
  - 서비스 쿼리를 처리하는 스레드가 작업하지 못하고 대기하게 됨
  - `innodb_deadlock_detect` 로 활성 여부 지정 가능

## 참고 자료
