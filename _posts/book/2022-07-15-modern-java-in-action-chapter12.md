---
title: '[Modern Java in Action] Chapter12. 새로운 날짜와 시간 API'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 12장에서는 날짜와 시간 API 에 대해 소개한다.  
자바 8에서 개선된 날짜와 시간 API 기능과 사용 방법에 대해 자세히 알아본다.


<!--more-->

기존에 존재하던 `Date`, `DateFormat` 기능들은 사용도 불편하고 문제가 있었다.  
그래서 많은 자바 개발자는 Joda-Time 같은 서드파티 라이브러리를 많이 사용했다.  
결국 자바 8에서는 Joda-Time의 많은 기능들을 `java.time` 패키지로 추가했다.

<br/>

## 12.1 LocalDate, LocalTime, Instant, Duration, Period 클래스

### LocalDate 와 LocalTime 사용

`LocalDate` 는 `of` 정적 팩터리 메서드로 인스턴스를 만들 수 있고  
인스턴스는 연도, 달, 요일 등을 반환하는 메서드를 제공한다.
`LocalDate.now()` 팩토리 메서드로 시스템 시계의 정보로 현재 날짜 정보를 가져올 수 있다. 

```java 
LocalDate date = LocalDate.of(2022, 7, 15)
int year      = date.getYear();        // 2022
Month month   = date.getMonth();       // JULY
int day       = date.getDayOfMonth();  // 15
DayOfWeek dow = date.getDayOfWeek();   // FRIDAY
int len       = date.lengthOfMonth();  // 31    (7월의 일 수)
boolean leap  = date.isLeapYear();     // false (윤년 아님)
```


`TemporalField` 는 시간 관련 객체에서 어떤 필드의 값에 접근할지 정의하는 인터페이스다.  
`ChronoFiled` 는 `TemporalField` 인퍼에이스를 정의하는 열거 타입으로 원하는 정보를 쉽게 가져올 수 있다.  

```java 
int year = date.get(ChronoField.YEAR);
int month = date.get(ChronoField.MONTH_OF_YEAR);
int day = date.get(ChronoField.DAY_OF_MONTH);
```

`LocalTime` 클래스로 시간을 표현할 수 잇다. 
```java 
LocalTime time = LocalTime.of(13, 45, 20);
int hour   = time.getHour();    // 13
int minute = time.getMinute();  // 45
int second = time.getSecond();  // 20
```

`parse` 정적 메서드를 이용하여 문자열로 인스턴스를 만드는 방법도 있다.  
문자열을 파싱할 수 없을 때는 `DateTimeParseException` 이 발생된다.

```java 
LocalDate date = LocalDate.parse("2021-07-15");
LocalTime time = LocalTime.parse("13:45:20");
```

### 날짜와 시간 조합

`LocalDateTime` 은 `LocalDate` 와 `LocalTime` 을 쌍으로 갖는 복합 클래스다. 

```java 
LocalDate date = LocalDate.now();
LocalTime time = LocalTime.now();
LocalDateTime dt1 = LocalDateTime.of(2022, Month.JULY, 15, 13, 45, 20);
LocalDateTime dt2 = LocalDateTime.of(date, time);
LocalDateTime dt3 = date.atTime(13, 45, 20);
LocalDateTime dt4 = date.atTime(time);
LocalDateTime dt5 = time.atDate(date);

// date 또는 time 인스턴스 추출
LocalDate date1 = dt1.toLocalDate();
LocalTime time1 = dt1.toLocalTime();
```

### Instant 클래스: 기계의 날짜와 시간

기계는 주, 날짜, 시간, 분으로 날짜와 시간을 계산하지 않고 연속된 시간에서 특정 지점을 하나의 큰수로 표현한다.  
`java.time.Instant` 클래스에서는 이와 같은 기계적인 관점에서 시간을 표현한다. (유닉스 에포크 시간, unix epoch time, 1970년 1월 1일 0시 0분 0초 UTC)

`Instant` 는 나노초(10억분의 1초)의 정밀도를 제공하며, `ofEpochSecond` 팩토리 메서드에 초를 넘겨서 인스턴스를 만들 수 있다.  
두번째 인수를 이용하면 나노초 단위로 시간 보정도 가능하다.

```java 
Instant.ofEpochSecond(3);
Instant.ofEpochSecond(3, 0);
Instant.ofEpochSecond(2, 1_000_000_000);   // 2초 이후의 1억 나노초(1초)
Instant.ofEpochSecond(4, -1_000_000_000);  // 4초 이전의 1억 나노초(1초)
```

기계 전용이기 때문에 사람이 읽을 수 있는 시간 정보는 제공하지 않는다. 

```java 
// java.time.temporal.UnsupportedTemporalTypeException: Unsupported field: DayOfMonth 발생 
int day = Instant.now().get(ChronoField.DAY_OF_MONTH);
```


### Duration 과 Period 정의

`Duration` 은 두 시간 객체 사이의 지속시간을 의미한다. 
`between` 정적 팩토리 메서드로 두 시간 객체 사이의 지속시간을 만들 수 있다.  
하지만 `Duration`은 초와 나노초로 시간 단위를 표현하므로 `LocalDate` 는 전달할 수 없다.

```java 
Duration d1 = Duration.between(time1, time2);
Duration d2 = Duration.between(dateTime1, dateTime2);
Duration d3 = Duration.between(instant1, instant2);
```

`Period` 클래스를 이용하면 년, 월, 일로 시간 표현을 할 수 있다.  
`Period` 의 `between` 정적 팩토리 메서드를 이용하면 두 `LocalDate` 의 차이를 구할 수 있다. 

```java 
Period tenDays = Period.between(
        LocalDate.of(2022, 7, 1),
        LocalDate.of(2022, 7, 15)
);
```

#### 간격을 표현하는 날자와 시간 클래스의 공통 메서드

| 메서드        | 정적  | 설명                                | 
|------------|-----|-----------------------------------|
| `betewwen` | 네   | 두 시간 사이의 간격을 생성                   |
| `from` | 네   | 시간 단위로 간격을 생성                     |
| `of` | 네   | 주어진 구성 요소에서 간격 인스턴스 생성            |
| `parse` | 네   | 문자열을 파싱해서 간격 인스턴스 생성              |
| `addTo` | 아니오 | 현재값의 복사본을 생성하고 지정된 Temporal 객체에 추가 |
| `get` | 아니오 | 현재 간격 정보값을 읽음                     |
| `isNegative` | 아니오 | 간격이 음수인지 확인                       |
| `isZero` | 아니오 | 간격이 0인이 확인                        |
| `minus` | 아니오 | 현재값에 주어진 시간을 뺀 복사본 생성             |
| `multipliedBy` | 아니오 | 현재값에 주어진 값을 곱한 복사본 생성             |
| `negated` | 아니오 | 주어진 값의 부호를 반전한 복사본 생성             |
| `plus` | 아니오 | 현재값에 주어진 시간을 더한 복사본 생성            |
| `subtractFrom` | 아니오 | 지정된 Temporal 객체에서 간격을 뺌           |

