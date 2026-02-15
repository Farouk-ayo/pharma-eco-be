import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
} from "@react-email/components";

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export const EmailLayout: React.FC<Readonly<EmailLayoutProps>> = ({
  children,
  previewText,
}) => (
  <Html>
    <Head>
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
      />
      {previewText && <Text>{previewText}</Text>}
      <link
        href="https://fonts.googleapis.com/css?family=Lato&display=swap"
        rel="stylesheet"
      />
      <style>{`
        body { font-family: 'Lato', sans-serif; }
        p, div { font-size: 14px; }
        body { color: #000000; }
        body a { color: #2c5530; text-decoration: none; }
        p { margin: 0; padding: 0; }
        .wrapper { width:100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        img.max-width { max-width: 100% !important; }
        @media screen and (max-width:480px) {
          .columns { width: 100% !important; }
          .column { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important; }
        }
      `}</style>
    </Head>
    <Body style={{ margin: 0, padding: 0, backgroundColor: "#f3f3f3" }}>
      <Container style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Section
          style={{
            padding: "0px",
            color: "#000000",
            textAlign: "left",
            backgroundColor: "#ffffff",
          }}
        >
          <Section
            style={{
              padding: "30px 20px 10px 20px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Img
              src={`${process.env.FRONTEND_URL}/pharma-eco-guard-d.webp`}
              width="100%"
              alt="PharmaEcoGuard"
              style={{ display: "block", maxWidth: "100%", height: "auto" }}
            />
          </Section>
          <Section
            style={{
              padding: "0px",
              lineHeight: "22px",
              textAlign: "inherit",
            }}
          >
            {children}
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
);