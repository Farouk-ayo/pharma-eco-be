import * as React from "react";
import {
  Text,
  Heading,
  Link,
  Button,
  Section,
} from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface PasswordResetEmailProps {
  firstName: string;
  resetUrl: string;
}

export const PasswordResetEmail: React.FC<
  Readonly<PasswordResetEmailProps>
> = ({ firstName, resetUrl }) => (
  <EmailLayout previewText="Reset Your PharmaEcoGuard Password">
    <Section style={{ padding: "40px 30px" }}>
      <Heading
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#2c5530",
          marginBottom: "20px",
        }}
      >
        Password Reset Request
      </Heading>

      <Text style={{ fontSize: "16px", marginBottom: "15px" }}>
        Hi {firstName},
      </Text>

      <Text style={{ fontSize: "16px", marginBottom: "15px" }}>
        We received a request to reset your password for your PharmaEcoGuard
        EMR account.
      </Text>

      <Text style={{ fontSize: "16px", marginBottom: "30px" }}>
        Click the button below to reset your password:
      </Text>

      <Section style={{ textAlign: "center", marginBottom: "30px" }}>
        <Button
          href={resetUrl}
          style={{
            backgroundColor: "#2c5530",
            color: "#ffffff",
            padding: "14px 32px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Reset Password
        </Button>
      </Section>

      <Text
        style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "8px",
        }}
      >
        Or copy and paste this link into your browser:
      </Text>
      <Text
        style={{
          fontSize: "12px",
          color: "#8898aa",
          wordBreak: "break-all",
          marginBottom: "30px",
        }}
      >
        {resetUrl}
      </Text>

      <Section
        style={{
          backgroundColor: "#fff4e6",
          border: "1px solid #ffd699",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "30px",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            color: "#995c00",
            margin: 0,
          }}
        >
          <strong>⏱️ Important:</strong> This link will expire in 1 hour for
          security reasons.
        </Text>
      </Section>

      <Text style={{ fontSize: "16px", marginBottom: "15px" }}>
        If you didn't request this password reset, please ignore this email.
        Your password will remain unchanged.
      </Text>

      <Text style={{ fontSize: "16px", marginBottom: "30px" }}>
        For security reasons, if you continue to receive these emails without
        requesting them, please contact us at{" "}
        <Link
          href="mailto:support@pharmaeco.org"
          style={{ color: "#2c5530", textDecoration: "underline" }}
        >
          support@pharmaeco.org
        </Link>
      </Text>

      <Text style={{ fontSize: "16px", marginBottom: "5px" }}>
        Best regards,
      </Text>
      <Text style={{ fontSize: "16px" }}>The PharmaEcoGuard Team</Text>
    </Section>

    <Section
      style={{
        padding: "20px 30px",
        borderTop: "1px solid #e6ebf1",
        textAlign: "center",
      }}
    >
      <Text style={{ fontSize: "12px", color: "#8898aa" }}>
        © {new Date().getFullYear()} PharmaEcoGuard. All rights reserved.
      </Text>
    </Section>
  </EmailLayout>
);