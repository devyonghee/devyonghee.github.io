---
title: 엘레강트 오브젝트 Chapter4. 은퇴
tags: [book, elegant-object, OOP]
categories: book
---

4장에서는 메서드 null, 예외 처리 등 객체나 메서드가 끝나는 시점에 관련된 내용을 소개해주고 있다.
특히, 예외 처리의 경우 매우 중요한 이슈이므로 유의해서 보도록 한다.


<!--more-->
<br>

## 4.1 절대 `NULL`을 반환하지 마세요

```java 
public String title() {
    if (/* title 이 없다면 */) {
        return null;
    }
    return "Object";
}
```

- 위 메서드를 이용하면 항상 `NullPointerException` 을 대비하고 있어야 하고 객체의 **신뢰**를 무너뜨린다.
- 객체는 자신의 행동을 **책임**지고 있어야 하며 간섭하지 않아야 한다.
- 중복으로 체크해야 되는 상황이 많아지면서 유지보수성도 현저히 떨어진다.
- **빠르게 실패하기 원칙(fail fast principle)** 을 고려하고 설계해야 한다.


### 4.1.1 빠르게 실패하기 vs 안전하게 실패하기

**빠르게 실패하기**가 문제를 빠르게 드러냄으로써 **안전성**과 **견고함**을 얻을 수 있고 **전체적인 품질이 향상**된다.
문제는 숨길수록 더 커지게 된다.

#### 안전하게 실패하기(fail safe)
  - 계속 실행될 수 있도록 노력
  - 실패한 상황을 구조하기 위해 노력
  - 다른 곳에서 상황을 처리하도록 null 을 반환
  
#### 빠르게 실패하기(fail fast)
  - 문제가 발생하면 바로 중단하고 예외
  - 실패 지점이 명확하고 문서화 되어 있어서 테스트를 쉽게 추가
  - 상황을 구조하지 않는 대신, 실패를 분명하게 만든다.

### 4.1.2 NULL의 대안

`NULL`은 절대 사용하면 안되는 키워드다. 예외를 던지거나, 컬렉션 또는 널 객체를 반환하자. 

#### 대안 1. 메서드를 두개로 나눈다.
- **한 메서드**에서 **객체의 존재**를 확인하고 **다른 메서드**에서 **객체**를 반환
- 객체를 찾는 메서드에서는 찾지 못한 경우 **예외**를 던짐
- **단점**) 요청을 두번 보내기 때문에 **비효율적**

```java 
public boolean exists(String name) {
    if (/* 데이터가 없다면*/) {
        return false;
    }
    return true;
}

public User user(String name) {
    return /* 데이터 반환 */
}
```

#### 대안 2. 객체 컬렉션을 반환
- 데이터가 없으면 빈 컬렉션을 반환
- `Optional` 과 비슷하지만 `Optional`은 객체 지향 사고 방식과 거리가 멀기 때문에 사용하지 않는 것을 추천
```java
public Collection<User> users(String name) {
    if (/* 데이터가 없다면 */) {
        return new ArrayList<(0);

    }
    return Collections.singleton(/* 데이터 반환 */);
}
```

#### 대안 3. 널 객체(null object) 디자인 패턴
- 원래의 객체처럼 보이지만 실제로 다르게 행동하는 객체 반환 (일부 메서드 호출할 경우 예외)
- **단점**) **제한된 상황**에서만 사용 가능
- **단점**) 반환된 **객체의 타입**을 **동일**하게 유지해야 함


### Review

`null` 키워드가 오류를 일으키고 유지보수하기 힘들도록 만드는 사실은 이미 많이 알려진 것 같다.
현재 최대한 `null` 을 반환하는 상황은 기피하고 있다.  
사실 이번장에서 `Optional` 객체가 **OOP**와 거리가 먼 개념이라는 것이 제일 새로웠다. 
이 객체 개념에 대해 다시 바라보게 되는 계기가 되었고 사용에 대해 고민해봐야겠다.

<br>

## 4.2 체크 예외(checked exception)만 던지세요 

**체크 예외**는 항상 **가시적**이고 안전하지 않은 메서드를 다루고 있다는 사실을 인식하도록 한다.  
**언체크 예외**는 어떤 예외가 던져질지 **예상할 수 없고** 예외 처리를 강요하지 않는다.

### 4.2.1 꼭 필요한 경우가 아니라면 예외를 잡지 마세요

메서드를 설계할 때 **예외를 잡을지**, **상위로 전파**할지 선택해야 한다. 예외를 반드시 잡아야하는 이유가 없다면 **잡아서는 안된**다.  

> **잡아서 로깅하기(catching and logging)** 역시 정당한 이유가 될 수 없고 끔찍한 **안티패턴**이다. 

#### 흐름 제어를 위한 예외 사용(using exceptions for flow control)
```java 
public int length(File file) {
    try {
        return content(file).lenght();
    } catch (IOException e) {
        return 0;
    }
}
```
- **문제를 은폐함**으로써 안 좋은 품질의 서비스를 제공
- 언젠가는 **비정상적 종료**될 수밖에 없음
- **안전하게 실패**하기 방법의 전형적인 예
- 문제의 원인 파악이 어려워짐

### 4.2.2 항상 예외를 체이닝 하세요

원래 예외를 무시하지 말고 항상 **체이닝** 해야 한다

#### 예외 되던지기(rethrowing)


```java
public int length(File file) throws Exception {
    try {
        return content(file).lenght();
    } catch (IOException ex) {
        // 근본 원인 ex 를 손실시키지 않고 상위로 이동
        return new Exception("길이를 계산할 수 없다", ex);
    }
}
```

위 코드는 **예외 체이닝(exception chaining)**의 훌륭한 예시다.
근본 원인을 무시하지 않고 **더 높은 수준으로 이동**시켜야 한다.

### 4.2.3 단 한번만 복구하세요

#### 항상 예외를 잡고 체이닝하고 던지고 가장 **최상위 수준**에서 한번만 **복구**해야한다. 
예외 후 복구는 **흐름 제어를 위한 예외 사용(using exceptions for flow control)**을 위한 **안티패턴**이다. 
하지만 예외를 잡지 않으면 사용자에게 시스템 메세지가 보여질 수 있으므로 **진입점**이 가장 적합한 위치다. 

### 4.2.4 관점-지향 프로그래밍을 사용하세요 (aspect-oriented programming, AOP)

**AOP**는 **연산을 단순화**시키고 **OOP 코드의 장황함을 제거**할 수 있는 기법으로 OOP와 궁합이 잘맞는다.  
일종의 **어댑터(adapter)**라고 볼 수 있다.

```java  
public String content() throws IOException {
    int attempt = 0;
    while (true) {
        try {
            return http();
        } catch (IOException ex) {
            if (attempt > = 2) {
                throw ex;
            }
        }
    }
}
```
위 코드는 최상위 수준 이전에 복구하기 때문에 올바르지 않지만 별다른 방법이 없다.

```java 
@RetryOnFailure(attempts = 3)
public String content() throws IOException {
    return http();
}
```
하지만 **AOP** 기법을 사용하면서 **핵심 클래스**로부터 덜 중요한 기술과 **메커니즘을 분리**하고 **코드 중복을 제거**한다.
**AOP**를 통해 OOP 의 깔끔한 상태를 유지한다.

 
### 4.2.5 하나의 예외 타입만으로도 충분합니다

사실 단 한번만 복구한다면 **예외 객체**만 있으면 되지 타입이 중요하지 않다.  
예외는 체이닝 한 후 다시 던질 때만 잡게 되므로 **타입정보는 필요 없다**.

