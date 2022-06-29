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

