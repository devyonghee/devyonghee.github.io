---
title: '[Modern Java in Action] Chapter20. OOP와 FP의 조화: 자바와 스칼라 비교'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 20장에서는 OOP와 FP 조화에 대해 설명한다.   
스칼라에 대해 가볍게 알아보고 자바와 스칼라의 기능을 비교해본다.  


<!--more-->

<br/>


## 20.1 스칼라 소개

스칼라의 특성에 대해 살펴볼 수 있도록 다음 사항들을 소개한다. 

- 명령형과 함수형으로 구현된 예제
- 스칼라가 지원하는 리스트, 집합, 맵, 스트림, 튜플, 옵션 등의 자료구조를 살펴보며 자바의 자료구조와 비교
- 스칼라의 트레이트 (자바의 인터페이스)


### Hello beer

#### 명령형 스칼라

```scala
object Beer {
    def main(args: Array[String]) {
        var n : Int = 2
        while (n < = 6) {
            println(s"Hello ${n}" bottoles of beer)
            n += 1
        }
    }
}
```

- 스칼라에서는 object 로 직접 싱글턴 객체를 만들 수 있음 (한 번에 단 하나의 인스턴스 생성)
- 내부 선언된 메서드는 정적 메서드로 간주 (`static` 없음)
- 문자열 보간법(string interpolation, 문자열 자체에 변수와 표현식 삽입)


#### 함수형 스칼라

자바의 함수형

```java 
public class Foo {
    public static void main(String[] args) {
        IntStream.rangeClosed(2, 6)
                 .forEach(n -> System.out.println("Hello " + n + " bottles of beer"));
    }
}
```

스칼라의 함수형

```scala
object Beer {
    def main(args: Array[String]) {
        2 to 6 foreach { n => println(s"Hello ${n} bottles of beer") }
    }
}
```

- 스칼라는 기본형이 없고 모든 것이 객체 (2는 Int 형식의 객체)
- 인픽스 형식 구현 가능 (`2.to(6)` -> `2 to 6`)
- 람다 표현식 문법은 비슷 (`->` 대신 `=>`)


### 기본 자료구조 : 리스트, 집합, 맵, 튜플, 스트림, 옵션

#### 컬렉션 만들기

```scala
val authorsToAge = Map("Raoul" -> 23, "Mario" -> 40, "Alan" -> 53)
```

- `->` 문법으로 키를 값에 대응
- 변수형 자동 추론 기능 (형식 생략 가능)
- `var` 대신 `val` 키워드 사용 (읽기 전용, 할당 불가)

```scala
// 리스트 만들기
val authors = List("Raoul", "Mario", "Alan")
// 집합 만들기
val numbers = Set(1, 1, 2, 3, 5, 8)
```


#### 불변과 가변

컬렉션은 기본적으로 불변(immutable)이다.  
스칼라에서는 자료를 공유하는 새로운 컬렉션을 만드는 방법으로 자료구조를 갱신한다.  

```scala
val numbers = Set(2, 5, 3);
val newNumbers = numbers + 8;
println(newNumbers)  // 2, 5, 3, 8
println(numbers)     // 2, 5, 3
```

#### 컬렉션 사용하기 

```scala
val fileLines = Source.fromFile("data.txt").getLines.toList()
val linesLongUpper = fileLines.filter(l => l.length() > 10)
                              .map(l => l.toUpperCase())
```

다음처럼 구현도 가능하다. 

```scala 
val linesLongUpper = fileLines filter (_.length() > 10) map (_.toUpperCase())
```

#### 튜플

자바는 튜플을 지원하지 않으므로 직접 자료구조를 구현해야 한다. 

```java 
public class Pair<X, Y> {
    public final X x;
    public final Y y;
    public Pair(X x, Y y) {
        this.x = x;
        this.y = y;
    }
}
```

스칼라는 튜플 축약어로 튜플을 만들 수 있는 기능을 제공한다. 

```scala
val raoul = ("Raoul", "+ 44 887007007")
val alan = ("Alan", "+44 883133700")

val book = (2018, "Modern Java in Action", "Manning")
val numbers = (42, 1337, 0, 3, 14)
```


#### 스트림

스칼라에서도 게으르게 평가되는 자료구조인 스트림을 제공한다.
자바의 스트림보다 다양한 기능이 존재하지만 메모리 효율성이 떨어짐

- 이전 요소가 접근할 수 있도록 기존의 계산값 기억
- 인덱스를 제공하여 인덱스로 스트림의 요소 접근 가능

#### 옵션

자바의 `Optional` 과 같은 기능 제공

```scala
def getCarInsuranceName(person: Option[Person], minAge: Int) =
    person.filter(_.getAge() >= minAge)
          .flatMap(_.getCar)
          .flatMap(_.getInsurance)
          .map(_.getName)
          .getOrElse("Unknown")
```
