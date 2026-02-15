import * as React from "react";
import { Text, Heading, Section } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface OTPEmailProps {
  firstName: string;
  otp: string;
}

export const OTPEmail: React.FC<Readonly<OTPEmailProps>> = ({
  firstName,
  otp,
}) => (
  <EmailLayout previewText="Your PharmaEcoGuard Password Reset Code">
    <Section style={{ padding: "40px 30px" }}>
      <Heading
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#2c5530",
          marginBottom: "20px",
        }}
      >
        Password Reset Code
      </Heading>

      <Text style={{ fontSize: "16px", marginBottom: "15px" }}>
        Hi {firstName},
      </Text>

      <Text style={{ fontSize: "16px", marginBottom: "30px" }}>
        Here's your password reset code for PharmaEcoGuard EMR:
      </Text>

      <Section
        style={{
          backgroundColor: "#f8faf9",
          border: "2px solid #2c5530",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <Text
          style={{
            fontSize: "48px",
            fontWeight: "700",
            letterSpacing: "8px",
            color: "#2c5530",
            fontFamily: "monospace",
            margin: 0,
          }}
        >
          {otp}
        </Text>
      </Section>

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
          <strong>⏱️ Important:</strong> This code will expire in 10 minutes for
          security reasons.
        </Text>
      </Section>

      <Text style={{ fontSize: "16px", marginBottom: "15px" }}>
        Enter this code on the password reset page to create a new password.
      </Text>

      <Text style={{ fontSize: "16px", marginBottom: "15px" }}>
        If you didn't request this code, please ignore this email. Your password
        will remain unchanged.
      </Text>

      <Text style={{ fontSize: "16px", marginBottom: "30px" }}>
        For security reasons, never share this code with anyone, including
        PharmaEcoGuard staff.
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