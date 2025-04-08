package com.example.zzyzzy.semiprojectv2.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleRecaptchaService {

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    private final String verifyURL = "https://www.google.com/recaptcha/api/siteverify";
    private final String secretKey = System.getenv("recaptcha.secretkey");

    public boolean verifyRecaptcha_old(String gRecaptchaResponse) {
        boolean verfiyResult = false;

        // reCAPTCHA 검증을 위한 URI 구성
        // UriComponentsBuilder는 Spring Framework에서 제공하는 클래스로, URI(URL)를 프로그래밍 방식으로 쉽게 구성할 수 있게 해주는 도구
        // 빌더 패턴을 사용하여 URI를 단계적으로 구성
        // 쿼리 파라미터, 경로 변수 등을 간편하게 추가
        // URL 인코딩을 자동으로 처리 (특수문자, 공백 등)
        // 메서드 체이닝을 통한 가독성 높은 코드 작성 가능
        URI uri = UriComponentsBuilder.fromUriString(verifyURL)
                .queryParam("secret", secretKey)
                .queryParam("response", gRecaptchaResponse)
                .build(true).toUri();

        // API 요청
        try {
            // Google reCAPTCHA 검증 API 호출
            // restTemplate: HTTP 요청 처리를 위한 Spring 템플릿
            String jsonResponse = restTemplate.getForObject(uri, String.class);
            log.info("recaptcha 결과: {}", jsonResponse);

            // JSON 응답 파싱 및 검증 결과 추출
            // objectMapper: JSON 처리를 위한 Jackson 라이브러리 객체
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            verfiyResult = rootNode.get("success").asBoolean();
        } catch (RestClientException e) {
            log.error("API 호출 실패: {}", e.getMessage(), e);
            throw new RuntimeException("reCAPTCHA 데이터를 가져오는 중 오류가 발생했습니다", e);
        }  catch (JsonProcessingException e) {
            log.error("JSON 파싱 오류: {}", e.getMessage(), e);
            throw new RuntimeException("유효하지 않은 응답 형식입니다", e);
        }

        return verfiyResult;
    }

    public boolean verifyRecaptcha(String gRecaptchaResponse) {
        // HTTP 요청 헤더 설정
        // Content-Type을 application/x-www-form-urlencoded로 지정하여 폼 데이터 전송 형식 선언
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // reCAPTCHA 검증에 필요한 폼 데이터 구성
        // MultiValueMap
        // Spring Framework에서 제공하는 특수한 Map 인터페이스
        // 하나의 키에 여러 값을 저장할 수 있음 (일반 Map은 키당 하나의 값만 가능)
        // 기본적으로 Map<K, List<V>> 형태의 구조
        // HTTP 요청 파라미터, 폼 데이터, HTTP 헤더와 같이 하나의 키에 여러 값이 필요한 경우에 사용

        // LinkedMultiValueMap
        // MultiValueMap 인터페이스의 구체적인 구현체
        // 내부적으로 LinkedHashMap을 사용하여 키의 삽입 순서를 보존
        // 순서가 중요한 경우에 사용 (예: HTTP 요청에서 파라미터 순서 유지)
        // HTTP 폼 데이터 전송, HTTP 요청 헤더 구성, URL 쿼리 파라미터 구성,
        // REST API 통신에서 복잡한 데이터 구조 전송 시 사용
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("secret", secretKey);
        map.add("response", gRecaptchaResponse);

        // HTTP 요청 엔티티 생성 (요청 본문과 헤더 포함)
        // HttpEntity
        // HttpEntity는 Spring Framework에서 제공하는 클래스로,
        // HTTP 요청이나 응답의 헤더와 본문(body)을 함께 표현
        // HTTP 헤더와 본문을 하나의 객체로 캡슐화
        // 제네릭 타입을 사용하여 다양한 타입의 본문 지원
        // REST 통신에서 요청/응답 데이터 구조화에 유용
        // 주요 하위 클래스:
        // RequestEntity: HttpEntity를 확장하여 HTTP 메서드(GET, POST 등)와 URI 정보 추가
        // ResponseEntity: HttpEntity를 확장하여 HTTP 상태 코드(200, 404 등) 정보 추가
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        try {
            // Google reCAPTCHA 검증 API에 POST 요청 전송
            ResponseEntity<String> response = restTemplate.postForEntity(verifyURL, request, String.class);

            // JSON 응답 파싱
            // objectMapper: JSON 처리를 위한 Jackson 라이브러리 객체
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            log.info("recaptcha 결과: {}", response);

            // reCAPTCHA 검증 결과 반환 (path 메서드는 해당 필드가 없을 경우 MissingNode 반환)
            return rootNode.path("success").asBoolean();
        } catch (Exception e) {
            log.error("reCAPTCHA 검증 오류", e);
            return false;
        }
    }
}
