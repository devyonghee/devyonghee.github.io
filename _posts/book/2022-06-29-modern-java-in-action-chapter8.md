---
title: '[Modern Java in Action] Chapter8. 컬렉션 API 개선'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 8장에서는 개선된 컬렉션에 대해 소개한다.
개선된 사항, 컬렉션 팩토리, 새로운 기능들에 대해 자세히 살펴본다.

<!--more-->

<br/>

## 8.1 컬렉션 팩토리

자바 9에서는 작은 컬렉션 객체를 쉽게 만들 수 있는 방법들을 제공한다.
이와 같은 기능은 다음과 같이 코드를 간단하게 줄일 수 도 있고,   
고정 크기의 리스트를 만들기 때문에 의도치 않게 컬렉션이 변화되지 않도록 막을 수 있다. (`UnsupportedOperationException` 발생)

```java 
List<String> friends = new ArraysList<>();
friends.add("Raphael");
friends.add("Olivia");
friends.add("Thibaut");

List<String> friends = Arrays.asList("Raphael", "Olivia", "Thibaut");
```


- 리스트 팩토리 (`List.of`)
  - 변경할 수 없는 리스트 (추가하려고 하면 `UnsupportedOperationException` 발생)
  - `null` 요소 금지  
  ```java 
  List<String> friends = List.of("Raphael", "Olivia", "Thibaut");
  ```
- 집합 팩토리 (`Set.of`)
  - 변경할 수 없는 집합
  - 중복된 요소를 제공 불가 (`IllegalArgumentException` 발생)  
  ```java 
  Set<String> friends = Set.of("Raphael", "Olivia", "Thibaut");
  ```
- 맵 팩토리 (`Map.of`, `Map.ofEntries`) 
  - 변경할 수 없는 맵  
  - 키와 값이 열개 이하인 경우 `Map.of`, 이상인 경우 `Map.ofEntries` 사용  
  ```java 
  Map<String, Integer> ageOfFriends = Map.of("Raphael", 30, "Olivia", 25, "Thibaut", 26);
  Map<String, Integer> ageOfFriends = Map.ofEntries(entry("Raphael", 30), 
                                                      entry("Olivia", 25), 
                                                      entry("Thibaut", 26));
  ```
<br/>


## 8.2 리스트와 집합 처리

- `removeIf`
  - 프레디케이트를 만족하는 요소를 제거
  - 기존 컬렉션을 변경
  - 코드가 단순해지고 `ConcurrentMOdificationException` 버그 방지
- `replaceAll`
  - `List`에서 이용할 수 있으며 `UnaryOperator` 함수로 각 요소를 변경
  - 새로운 컬렉션을 생성하지 않고 간단하게 변경 가능


<br/>

## 8.3 맵 처리

- `forEach` 메서드
  - `BiConsumer`를 인수로 받는 키와 값을 반복하면서 확인하는 작업
  - 기존에는 `Map.Entry<K, V>` 을 이용함  
  ```java 
  ageOfFriends.forEach((friend, age) -> System.out.println(friend + " is " + age + " yeas old"));
  ```
- 정렬 메서드 (`Entry.comparingByValue`, `Entry.comparingByKey`)
  - 맵의 항목을 값 또는 키를 기준으로 정렬  
  ```java 
  favoriteMovies.entrySet()
      .stream()
      .sorted(Entry.comparingByKey())
      .forEachOrdered(System.out::println);
  // Cristina = Matrix 
  // Olivia = James Bond 
  // Raphael = Star Wars 
  ```
- `getOrDefault` 메서드
  - 첫 번째 인수는 키, 두 번째 인수는 기본값을 받고 키가 존재하지 않으면 기본값 반환
  - 기존에는 `null` 이 반환되어 `NullPointerException` 발생될 여지가 있었음  
  ```java 
  // matrix 출력
  System.out.println(favoriteMovies.getOrDefault("not exists key", "matrix")) 
  ```  
- 계산 패턴(`computeIfAbsent`, `computeIfPresent`, `comput`)
  - `computeIfAbsent`: 제공된 키에 해당하는 값이 없으면 키를 이용해 새 값을 계산하고 추가
  - `computeIfPresent`: 제공된 키가 존재하면 새 값을 계산하고 맵에 추가
  - `comput`: 제공된 키로 새값을 계산하고 맵에 저장
- 삭제 패턴 (`remove`)
  - 기존에는 `remove`는 삭제만 되었지만 자바 8에서는 특정한 키 값과 연관된 경우에만 제거하는 메서드가 제공된다.  
  ```java 
  // 키와 값이 동일한 경우에만 삭제
  favouriteMovies.remove(key, value); 
  ```  
- 교체 패턴 (`replaceAll`, `Replace`)
  - `replaceAll`: 모든 항목의 값을 `BiFunction` 을 적용한 결과들로 교체
  - `Replace`: 키가 존재하면 맵의 값을 변경 (키가 특정 값으로 매핑된 경우에도 교체 가능)
- 합침
  - `merge` 를 이용하면 값을 유연하게 합칠 수 있음
  - `putAll` 을 이용하면 합쳐지긴 하지만 중복된 키에 대한 처리 불가능  
  ```java 
  // 두번째 인수는 키가 없거나 반환 값이 null 인 경우 기존 값으로 사용
  // 세번째 인수는 중복된 키가 어떻게 합쳐질 지 결정하는 BIFunction
  moviesToCount.merge(movieName, 1L, (key, count) -> count + 1L) 
  ```  
  
