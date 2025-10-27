"""Custom middleware for security headers."""
from __future__ import annotations

from django.conf import settings
from django.utils.deprecation import MiddlewareMixin


class ContentSecurityPolicyMiddleware(MiddlewareMixin):
    """Inject Content-Security-Policy headers.

    The middleware reads the frame ancestors from settings and applies them to
    the CSP header so that the application can be embedded only in the allowed
    frames (e.g. VK Mini Apps iframe).
    """

    header_name = "Content-Security-Policy"

    def process_response(self, request, response):  # noqa: D401 - standard Django hook
        frame_ancestors = getattr(settings, "CSP_FRAME_ANCESTORS", [])
        if frame_ancestors:
            directive_value = " ".join(frame_ancestors)
        else:
            directive_value = "'self'"
        response[self.header_name] = f"frame-ancestors {directive_value};"
        return response
