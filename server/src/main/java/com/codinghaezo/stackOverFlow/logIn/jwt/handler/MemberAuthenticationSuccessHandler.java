package com.codinghaezo.stackOverFlow.logIn.jwt.handler;

import com.codinghaezo.stackOverFlow.logIn.jwt.jwt.JwtTokenizer;
import com.codinghaezo.stackOverFlow.member.Member;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class MemberAuthenticationSuccessHandler implements AuthenticationSuccessHandler {  // (1)


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
<<<<<<< HEAD
        // 인증 성공 후, 로그를 기록하거나 사용자 정보를 response로 전송하는 등의 추가 작업을 할 수 있다.
=======
>>>>>>> dbdf443fec665edebafd556406b80499ed10b7f2
        log.info("request Authorization 값 " + request.getHeader("Authorization"));
        log.info("response Authorization 값 " + response.getHeader("Authorization"));
        log.info("request userProfile 값 " + request.getHeader("userProfile"));
        log.info("response userProfile 값 " + response.getHeader("userProfile"));
    }
}