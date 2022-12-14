# SNS API service

## 목차

[주요 기능](#주요-기능)

[ERD](#erd)

[Test](#test)

[API Docs](#api-docs)

[기술 스택](#기술-스택)

## 주요 기능

### 1. 유저 관리
  - 유저 회원가입
  
  - 유저 로그인 및 인증
  
    - 토큰 방식 JWT 인증

### 2. 게시글
  - 게시글 생성
    - 제목, 내용, 해시태그 등을 입력하여 생성
    - 해시태그는 #으로 시작되고 ,로 구분되는 텍스트로 입력
    - 작성자 정보는 해당 API를 요청한 인증정보에서 추출하여 사용
    
  - 게시글 수정
    - 작성자만 수정 가능
    
  - 게시글 삭제
    - 작성자만 삭제 가능
    
  - 게시글 목록 (아래 기능들은 서로 조합하여 사용 가능)
    - 사용자는 게시글 목록을 원하는 값으로 정렬 가능 (default: 작성일, / 작성일, 좋아요 수, 조회수 중 1개 만 선택가능)
    - 사용자는 입력한 키워드로 해당 키워드를 제목에 포함한 게시물을 조회 가능
    - 사용자는 입력한 해시태그 키워드로 해당 해시태그를 포함한 게시물을 필터링 가능  
      - 예시 1) some-url?hastags=서울 >> “서울" 해시태그를 가진 게시글 목록.  
        [ex. “서울” 검색 시 > #서울(검색됨) / #서울맛집 (검색안됨)  / #서울,#맛집(검색됨)]  
      - 예시 2) some-url?hastags=서울,맛집 >> “서울" 과 “맛집” 해시태그를 모두 가진 게시글 목록.  
        [ex. “서울,맛집” 검색 시 > #서울(검색안됨) / #서울맛집 (검색안됨)  / #서울,#맛집(검색됨)]  
  
    - 사용자는 1 페이지 당 게시글 수를 조정 가능 (default : 10건)
    
  - 게시글 상세보기
    - 작성자를 포함한 사용자는 본 게시글에 좋아요 및 좋아요 취소 가능 
    - 작성자를 포함한 사용자가 게시글을 상세보기 하면 조회수 1 증가 (횟수 제한 없음)
    
### 3. 파일 업로드 및 삭제
  - 파일 업로드
    - 게시글 작성시 같이 호출하면 AWS S3 storage에 이미지 업로드 가능
    
  - 파일 삭제
    - AWS S3 storage에서 이미지 삭제 가능 
    
## ERD

![image](https://user-images.githubusercontent.com/99064214/206108839-0203ed13-f285-4262-87aa-79aaa2f747b3.png)

## Test
### Service Unit Test
![Service_test1](https://user-images.githubusercontent.com/99064214/208227270-2b58939e-054b-4589-941f-4d4bb00b518e.png)   
![Service_test2](https://user-images.githubusercontent.com/99064214/208227280-bb179f70-0fa0-4446-9994-1d4c56e65747.png)


## API Docs


npm start 후 http://localhost:3000/api-docs   
or   
[sns-service-swagger.pdf](https://github.com/developer-yechan/SNS-Service/files/10183084/sns-service-swagger.pdf)


## 기술 스택
### Nestjs, Typescript, PostgreSQL, Typeorm, Swagger, Jest
