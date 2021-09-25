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



