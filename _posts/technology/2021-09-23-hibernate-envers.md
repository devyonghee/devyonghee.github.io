---
title: hibernate envers 이용해서 변경 데이터 기록하기
tags: [hibernate, jpa]
categories: technology
---

envers 모듈은 entity 객체 데이터에 대해 변경을 감지하고 기록해주는 편리한 모델이다.
데이터에 대한 이력들을 신경쓰지 않고 편리하게 버저닝하고 기록하고 싶을 때 아주 유용하다.
    
<!--more-->

현재 프로젝트를 진행하면서 중요한 데이터를 다루다보니 변경이 있을 때마다 기록이 필요했다.
별도의 history 테이블도 같이 생성하고 Create, Update, Delete 시에 데이터를 추가하는 로직이 필요했다.
하지만 이런 로직이 많아질수록 entity의 코드는 복잡해지고 관리가 힘들어진다.  

이러한 문제는 envers를 도입하면서 쉽게 해결할 수 있었다. 
envers 모듈은 hibernate와 같이 동작하며, hibernate annotation 또는 entity manager가 반드시 필요하다. 
jpa 환경에서도 동작이 가능하기 때문에 매우 편리하다.  
그렇다면 envers를 설정하고 사용하는 방법을 자세하게 알아보도록 하겠다.



## 0. 프로젝트 세팅
envers 를 본격적으로 추가하기전 프로젝트부터 세팅하도록 한다.  
docker-compose 를 이용해서 mysql db 를 준비했다.

```yaml
version: "3"

services:
  database:
    image: mysql:5.7
    ports:
      - 3306:3306
    volumes:
      - ./database/:/var/lib/mysql/
    environment:
      MYSQL_DATABASE: library
      MYSQL_ROOT_PASSWORD: password
``` 

spring boot 세팅은 다음과 같이 했다. ddl 은 작성하기 번거로우니 간단하게 `create-drop` 옵션을 이용했다.
```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    password: password
    username: root
    url: jdbc:mysql://localhost:3306/library
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: create-drop
```

## 1. evners 의존성 추가

### gradle
```
implementation 'org.hibernate:hibernate-envers'
```
### maven
```
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-envers</artifactId>
</dependency>
```

## 2. `@Audited` 애노테이션 추가

데이터 기록이 필요한 Entity 에 `@Audited` 를 추가한다.

```
@Entity
@Audited
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private String title;

    @Column
    private int price;

    @Column
    private String content;
}
``` 

만약 기록이 필요없는 데이터가 있다면 다음과 같이 해당 필드에 `@NotAudited`를 추가해주도록 한다.  

```java
@Entity
@Audited
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private String title;

    @Column
    private int price;

    @Column
    @NotAudited
    private String content;
}
```

