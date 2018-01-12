package br.com.basis.abaco.web.rest;

import java.net.URISyntaxException;
import java.util.Collections;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import br.com.basis.abaco.security.AuthenticationConstants;
import br.com.basis.abaco.security.CookieUtil;
import br.com.basis.abaco.security.jwt.JWTConfigurer;
import br.com.basis.abaco.security.jwt.TokenProvider;
import br.com.basis.abaco.web.rest.vm.LoginVM;

@RestController
@RequestMapping("/api")
public class UserJWTController {

	private final Logger log = LoggerFactory.getLogger(UserJWTController.class);

	private final TokenProvider tokenProvider;

	private final AuthenticationManager authenticationManager;

	private CookieUtil cookieUtil;

	public UserJWTController(TokenProvider tokenProvider, AuthenticationManager authenticationManager,
			CookieUtil cookieUtil) {
		this.tokenProvider = tokenProvider;
		this.authenticationManager = authenticationManager;
		this.cookieUtil = cookieUtil;
	}

	@PostMapping("/authenticate")
	@Timed
	public ResponseEntity authorize(@Valid @RequestBody LoginVM loginVM, HttpServletResponse response) {

		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
				loginVM.getUsername(), loginVM.getPassword());

		try {
			Authentication authentication = this.authenticationManager.authenticate(authenticationToken);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			boolean rememberMe = (loginVM.isRememberMe() == null) ? false : loginVM.isRememberMe();
			String jwt = tokenProvider.createToken(authentication, rememberMe);
			response.addHeader(JWTConfigurer.AUTHORIZATION_HEADER, "Bearer " + jwt);

			// Cookie
			cookieUtil.create(response, jwt);

			return ResponseEntity.ok(new JWTToken(jwt));
		} catch (AuthenticationException ae) {
			log.trace("Authentication exception trace: {}", ae);
			return new ResponseEntity<>(Collections.singletonMap("AuthenticationException", ae.getLocalizedMessage()),
					HttpStatus.UNAUTHORIZED);
		}
	}

	@GetMapping("/user/details")
	@Timed
	public ResponseEntity<UserDetails> getUserDetails(
			@CookieValue(AuthenticationConstants.TOKEN_NAME) String token) throws URISyntaxException {
		Authentication auth = tokenProvider.getAuthentication(token);
		
		return null;
	}
}
