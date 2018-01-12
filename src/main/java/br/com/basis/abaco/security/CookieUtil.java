package br.com.basis.abaco.security;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

@Component
public class CookieUtil {
	
	/**
	 * Método que cria o cookie de autenticação no sistema.
	 * 
	 * @param httpServletResponse
	 *            HttpServletResponse
	 * @param value
	 *            valor do cookie
	 * @param secure
	 *            define se o cookie é 'secure'
	 * @param maxAge
	 *            validade do cookie
	 */
	public void create(HttpServletResponse httpServletResponse, String value, Boolean secure, Integer maxAge) {
		Cookie cookie = new Cookie(AuthenticationConstants.TOKEN_NAME, value);
		cookie.setSecure(secure);
		cookie.setHttpOnly(false);
		cookie.setMaxAge(maxAge);
//		cookie.setDomain(DOMAIN);
		cookie.setPath("/");
		httpServletResponse.addCookie(cookie);
	}

	public void create(HttpServletResponse httpServletResponse, String value) {
		create(httpServletResponse, value, AuthenticationConstants.DEFAULT_SECURE,
				AuthenticationConstants.DEFAULT_MAX_AGE);
	}

	/**
	 * Método que invalida os cookie de autenticação.
	 * 
	 * @param httpServletResponse
	 *            httpServletResponse
	 * @param httpServletRequest
	 *            httpServletRequest
	 */
	public void clear(HttpServletResponse httpServletResponse) {
		Cookie cookieJWT = new Cookie(AuthenticationConstants.TOKEN_NAME, null);
		cookieJWT.setPath("/");
		cookieJWT.setHttpOnly(false);
		cookieJWT.setMaxAge(0);
//		cookieJWT.setDomain(DOMAIN);
		httpServletResponse.addCookie(cookieJWT);
	}

	/**
	 * Método que retorna o valor do cookie de autenticação
	 * 
	 * @param httpServletRequest
	 * @return valor do cookie de autenticação
	 */
	public String getValue(HttpServletRequest httpServletRequest) {
		Cookie cookie = WebUtils.getCookie(httpServletRequest, AuthenticationConstants.TOKEN_NAME);
		return cookie != null ? cookie.getValue() : null;
	}

}
