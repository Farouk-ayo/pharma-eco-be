import * as React from "react";
import {
  Text,
  Heading,
  Link,
  Button,
  Section,
} from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface WelcomeEmailProps {
  firstName: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  firstName,
}) => (
  <EmailLayout previewText="Welcome to PharmaEcoGuard EMR - Let's Get Started">
    <Section style={{ padding: "40px 30px" }}>
      <Heading
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#2c5530",
          marginBottom: "20px",
        }}
      >
        Welcome to PharmaEcoGuard!
      </Heading>

      <Text style={{ fontSize: "16px", marginBottom: "15px" }}>
        Hi {firstName},
      </Text>

      <Text style={{ fontSize: "16px", marginBottom: "15px" }}>
        Thank you for joining PharmaEcoGuard EMR. We're thrilled to have you on
        board!
      </Text>

      <Text style={{ fontSize: "16px", marginBottom: "25px" }}>
        PharmaEcoGuard EMR is a unified system that helps pharmacies improve
        patient care and protect the environment. Our platform streamlines
        pharmacy operations, enhances medication safety, and guides proper
        pharmaceutical waste disposal.
      </Text>

      <Section
        style={{
          backgroundColor: "#f8faf9",
          padding: "25px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#2c5530",
            marginBottom: "10px",
          }}
        >
          🏥 Medication Management
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "20px" }}>
          Comprehensive prescription tracking and patient medication histories
        </Text>

        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#2c5530",
            marginBottom: "10px",
          }}
        >
          🌍 Environmental Protection
        </Text>
        <Text style={{ fontSize: "14px", marginBottom: "20px" }}>
          Guided pharmaceutical waste disposal to reduce environmental
          contamination
        </Text>

        <Text
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#2c5530",
            marginBottom: "10px",
          }}
        >
          🛡️ Safety Guard
        </Text>
        <Text style={{ fontSize: "14px" }}>
          Clinical decision support and proper disposal protocols
        </Text>
      </Section>

      <Section style={{ textAlign: "center", marginBottom: "30px" }}>
        <Button
          href={`${process.env.FRONTEND_URL}/pharmaeco-guard/dashboard`}
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
          Get Started
        </Button>
      </Section>

      <Text style={{ fontSize: "16px", marginBottom: "30px" }}>
        Need help getting started? Our support team is here for you at{" "}
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