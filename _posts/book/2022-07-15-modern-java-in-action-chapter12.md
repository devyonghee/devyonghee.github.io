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


<br/>

## 12.2 날짜 조정, 파싱, 포매팅

`withAttribute` 메서드를 이용하면 절대적으로, `plus` 또는 `minus` 메서드를 이용하면 상대적으로 기존 객체를 변경하지 않고 변경된 속성을 포함한 객체를 생성할 수 있다.    
첫번째 인수에 `TemporalField` 메서드를 추가하면 더 범용적으로 메서드를 활용할 수 있다.
만약 해당 필드를 지원하지 않으면 `UnsupportedTemporalTypeException` 이 발생된다. 

```java 
// 절대적인 방식
LocalDate date1 = LocalDate.of(2022, 7, 16);                 // 2022-07-16
LocalDate date2 = date1.withYear(2021);                      // 2021-07-16
LocalDate date3 = date2.withDayOfMonth(25);                  // 2021-07-25
LocalDate date4 = date3.with(ChronoField.MONTH_OF_YEAR, 2);  // 2021-02-25

// 상대적인 방식
LocalDate date1 = LocalDate.of(2022, 7, 16);                 // 2022-07-16
LocalDate date2 = date1.plusWeeks(1);                        // 2022-07-23
LocalDate date3 = date2.minusYears(1);                       // 2021-07-23
LocalDate date4 = date3.plus(3, ChronoUnit.MONTHS);          // 2021-10-23
```

#### 특정 시점을 표현하는 날짜 시간 클래스의 공통 메서드

| 메서드            | 정적  | 설명                                                     | 
|----------------|-----|--------------------------------------------------------|
| `from`         | 네   | 주어진 Temporal 객체로 인스턴스 생성                               |
| `now`          | 네   | 시스템 시계로 Temporal 객체 생성                                 |
| `of`           | 네   | 주어진 구성요소에서 Temporal 객체 생성                              |
| `parse`        | 네   | 문자열을 파싱해서 Temporal 객체 생성                               |
| `atOffset`     | 아니오 | 시간대 오프셋과 Temporal 객체 합침                                |
| `atZone`       | 아니오 | 시간대 오프셋과 Temporal 객체 합침                                |
| `format`       | 아니오 | 지정된 포매터를 이용해서 <br/> Temporal 객체를 문자열로 변환 (Instant 지원 x) |
| `get`          | 아니오 | Temporal 객체의 상태를 읽음                                    |
| `minus`        | 아니오 | 특정 시간을 뺀 Temporal 객체의 복사본 생성                           |
| `plus`         | 아니오 | 특정 시간을 더한 Temporal 객체의 복사본 생성                          |
| `with`         | 아니오 | 일부 상태를 바꾼 Temporal 객체의 복사본 생성                          |

### TemporalAdjusters 사용하기

`TemporalAdjusters` 을 전달하여 `with` 메서드에 다양한 동작을 수행할 수 있다.

```java
import static java.time.temporal.TemporalAdjusters.*;
LocalDate date1 = LocalDate.of(2022, 7, 16);                // 2022-07-16
LocalDate date2 = date1.with(nextOrSame(DayOfWeek.SUNDAY)); // 2022-07-17
LocalDate date3 = date2.with(lastDayOfMonth());             // 2022-07-31
```

#### 팩토리 메서드

| 메서드                   | 설명                                                               | 
|-----------------------|------------------------------------------------------------------|
| `dayOfWeekInMonth`    | 서수 요일에 해당하는 날짜를 반환하는 <br/> TemporalAdjuster 반환(음수면 월의 끝에서 거꾸로 계산) |
| `firstDayOfMonth`     | 현재 달의 첫 번째 날짜를 반환하는 TemporalAdjuster 반환                          |
| `firstDayOfNextMonth` | 다음 달의 첫 번째 날짜를 반환하는 TemporalAdjuster 반환                          |
| `firstDayOfNextYear`  | 내년의 첫 번째 날짜를 반환하는 TemporalAdjuster 반환                            |
| `firstDayOfYear`      | 올해의 첫 번째 날짜를 반환하는 TemporalAdjuster 반환                            |
| `firstInMonth`        | 현재 달의 첫 번째 요일에 해당하는 날짜를 반환하는 TemporalAdjuster 반환                 |
| `lastDayOfMonth`      | 현재 달의 마지막 날짜를 반환하는 TemporalAdjuster 반환                           |
| `lastDayOfNextMonth`  | 다음 달의 마지막 날짜를 반환하는 TemporalAdjuster 반환                           |
| `lastDayOfNextYear`   | 내년의 마지막 날짜를 반환하는 TemporalAdjuster 반환                             |
| `lastDayOfYear`       | 올해의 마지막 날짜를 반환하는 TemporalAdjuster 반환                             |
| `lastInMonth`         | 현재 달의 마지막 요일에 해당하는 날짜를 반환하는 TemporalAdjuster 반환                  |
| `next`, `previous`    | 지정한 요일이 처음/이전으로 나타나는 날짜를 반환하는 TemporalAdjuster 반환                |
| `nextOrSame`          | 지정한 요일이 같거나 처음으로 나타나는 날짜를 반환하는 TemporalAdjuster 반환               |
| `previousOrSame`      | 지정한 요일이 같거나 이전으로 나타나는 날짜를 반환하는 TemporalAdjuster 반환               |


### 날짜와 시간 객체 출력과 파싱

날짜와 시간 관련 포매팅과 파싱 전용 패키지 `java.time.format`이 추가되었다.  
그 중 `DateTimeFormatter` 클래스는 정적 팩토리 메서드와 상수(`BASIC_ISO_DATE`, `ISO_LOCAL_DATE`)를 이용해 쉽게 포매터를 만들 수 있는 가장 중요한 클래스다.

```java
// 포매팅 
LocalDate date = LocalDate.of(2022, 7, 16)
date.format(DateTimeFormatter.BASIC_ISO_DATE);  // 20220716
date.format(DateTimeFormatter.ISO_LOCAL_DATE);  // 2022-07-16

// 파싱
LocalDate.parse("20220716", DateTimeFormatter.BASIC_ISO_DATE);
LocalDate.parse("2022-07-16", DateTimeFormatter.ISO_LOCAL_DATE);

// 특정 패턴 생성
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
LocalDate date1 = LocalDate.of(2022, 7, 16);
String formattedDate = date1.format(formatter);        // 16/07/2022
LocalDate date2 = LocalDate.parse(formattedDate, formatter);

// 지역화된 DateTimeFormmater
DateTimeFormatter italianFormatter = DateTimeFormatter.ofPattern("d. MMMM yyyy", Locale.ITALIAN);
LocalDate date1 = LocalDate.of(2022, 7, 16);
String formattedDate = date1.format(italianFormatter);        // 16. luglio 2022
LocalDate date2 = LocalDate.parse(formattedDate, italianFormatter);

// DateTimeFormatterBuilder 로 포매터 생성하기
DateTimeFormatter italianFormatter = new DateTimeFormatterBuilder()
        .appendText(ChronoField.DAY_OF_MONTH)
        .appendLiteral(". ")
        .appendText(ChronoField.MONTH_OF_YEAR)
        .appendLiteral(" ")
        .appendText(ChronoField.YEAR)
        .parseCaseInsensitive()
        .toFormatter(Locale.ITALIAN);
```

