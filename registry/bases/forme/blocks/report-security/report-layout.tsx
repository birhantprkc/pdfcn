import { Document, Page, StyleSheet, View } from "@formepdf/react";

import type { PdfcnTheme } from "@/registry/themes";

import {
  Badge,
  DataTable,
  Divider,
  KeyValue,
  PageFooter,
  PageHeader,
  PdfGraph,
  PdfList,
  PdfcnThemeProvider,
  Section,
  Stack,
  Text,
  usePdfcnTheme,
} from "../../components";
import type { BaseReportData } from "./report.types";

export interface ReportTemplateProps {
  theme?: PdfcnTheme;
  data?: BaseReportData;
}

type ReportGraphVariant =
  | "bar"
  | "horizontal-bar"
  | "line"
  | "area"
  | "pie"
  | "donut";

interface ReportLayoutProps {
  data: BaseReportData;
  titlePrefix: string;
  statusLabel: string;
  statusTone: "success" | "warning" | "destructive" | "info";
  graphVariant: ReportGraphVariant;
  graphTitle: string;
  graphSubtitle: string;
  graphLegend?: "bottom" | "right" | "none";
  graphShowValues?: boolean;
  graphColors?: string[];
  graphData?: { label: string; value: number }[];
}

const toneColor = (
  theme: PdfcnTheme,
  tone: "success" | "warning" | "destructive" | "info"
) => {
  if (tone === "success") {
    return theme.colors.success;
  }
  if (tone === "warning") {
    return theme.colors.warning;
  }
  if (tone === "destructive") {
    return theme.colors.destructive;
  }
  return theme.colors.info;
};

export const ReportLayout = ({
  data,
  titlePrefix,
  statusLabel,
  statusTone,
  graphVariant,
  graphTitle,
  graphSubtitle,
  graphLegend = "none",
  graphShowValues = false,
  graphColors,
  graphData,
}: ReportLayoutProps) => {
  const theme = usePdfcnTheme();
  const accent = toneColor(theme, statusTone);

  const styles = StyleSheet.create({
    col: {
      flex: 1,
    },
    graphShell: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
      borderRadius: theme.primitives.borderRadius.md,
      borderStyle: "solid",
      borderWidth: 1,
      padding: 12,
    },
    metricCard: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
      borderRadius: theme.primitives.borderRadius.md,
      borderStyle: "solid",
      borderWidth: 1,
      padding: 8,
      width: "48.6%",
    },
    metricLabel: {
      color: theme.colors.mutedForeground,
      fontSize: 8,
      letterSpacing: 0.5,
      marginBottom: 2,
      textTransform: "uppercase",
    },
    metricTrend: {
      color: theme.colors.mutedForeground,
      fontSize: 9,
    },
    metricValue: {
      color: theme.colors.foreground,
      fontSize: 14,
      fontWeight: theme.primitives.fontWeights.bold,
      marginBottom: 2,
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    page: {
      backgroundColor: theme.colors.background,
      paddingBottom: theme.spacing.page.marginBottom,
      paddingLeft: theme.spacing.page.marginLeft,
      paddingRight: theme.spacing.page.marginRight,
      paddingTop: theme.spacing.page.marginTop,
    },
    toolbar: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    twoColumn: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 10,
    },
  });

  return (
    <Document title={`${titlePrefix} ${data.period}`}>
      <Page size="A4" margin={48}>
        <View style={styles.page as never}>
          <PageHeader
            variant="two-column"
            title={data.title}
            subtitle={`${titlePrefix} · ${data.subtitle}`}
            rightText={data.period}
            rightSubText={`Generated ${data.generatedAt}`}
            marginBottom={14}
          />

          <View style={styles.toolbar}>
            <Badge label={statusLabel} variant={statusTone} size="sm" />
            <Text variant="xs" color="mutedForeground" noMargin>
              Author: {data.author}
            </Text>
          </View>

          <Section variant="card" padding="md" noWrap>
            <Text variant="sm" transform="uppercase" color="mutedForeground">
              Executive Summary
            </Text>
            <View style={styles.metricsGrid}>
              {data.summary.map((metric) => (
                <View
                  key={metric.label}
                  style={
                    [
                      styles.metricCard,
                      {
                        borderLeftColor: metric.tone
                          ? toneColor(theme, metric.tone)
                          : accent,
                        borderLeftWidth: 3,
                      },
                    ] as never
                  }
                >
                  <Text style={styles.metricLabel} noMargin>
                    {metric.label}
                  </Text>
                  <Text style={styles.metricValue} noMargin>
                    {metric.value}
                  </Text>
                  {metric.trend ? (
                    <Badge
                      label={metric.trend}
                      size="sm"
                      variant={metric.tone ?? "info"}
                    />
                  ) : null}
                </View>
              ))}
            </View>
          </Section>

          <Section padding="md" noWrap>
            <Text variant="sm" transform="uppercase" color="mutedForeground">
              Performance Trend
            </Text>
            <View style={styles.graphShell}>
              <PdfGraph
                variant={graphVariant}
                data={graphData ?? data.series}
                title={graphTitle}
                subtitle={graphSubtitle}
                yLabel={undefined}
                xLabel={undefined}
                showGrid={graphVariant !== "pie" && graphVariant !== "donut"}
                showValues={graphShowValues}
                smooth={graphVariant === "line" || graphVariant === "area"}
                legend={graphLegend}
                height={200}
                colors={graphColors}
                fullWidth
                containerPadding={12}
                wrapperPadding={12}
                style={{ marginBottom: 0 }}
              />
            </View>
          </Section>

          <Section padding="md">
            <Text variant="sm" transform="uppercase" color="mutedForeground">
              Delivery Table
            </Text>
            <DataTable
              variant="compact"
              size="compact"
              stripe
              columns={[
                { header: "Stream", key: "label" },
                { header: "Owner", key: "owner" },
                { align: "center", header: "Status", key: "status" },
                {
                  align: "right",
                  header: "Progress",
                  key: "progress",
                  render: (value) => `${String(value)}%`,
                },
                { align: "right", header: "Risk", key: "risk" },
              ]}
              data={data.rows}
              footer={{
                label: "Totals",
                owner: "-",
                progress: Math.round(
                  data.rows.reduce((sum, row) => sum + row.progress, 0) /
                    Math.max(data.rows.length, 1)
                ),
                risk: "-",
                status: "-",
              }}
            />
          </Section>

          <Section padding="md" variant="card" noWrap>
            <Text variant="sm" transform="uppercase" color="mutedForeground">
              Highlights & Risks
            </Text>
            <View style={styles.twoColumn}>
              <View style={styles.col}>
                <PdfList
                  variant="checklist"
                  items={data.highlights.map((item) => ({
                    checked: true,
                    text: item,
                  }))}
                  gap="sm"
                />
              </View>
              <View style={styles.col}>
                <KeyValue
                  size="sm"
                  divided
                  items={[
                    {
                      key: "Open Risks",
                      value: `${data.rows.filter((r) => r.risk !== "Low").length}`,
                    },
                    {
                      key: "On-Track Streams",
                      value: `${data.rows.filter((r) => r.status === "On Track").length}/${data.rows.length}`,
                    },
                    {
                      key: "Average Progress",
                      value: `${Math.round(
                        data.rows.reduce((sum, row) => sum + row.progress, 0) /
                          Math.max(data.rows.length, 1)
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>
            <Divider />
            <Stack gap="sm">
              <Text variant="xs" color="mutedForeground" noMargin>
                Best practice: keep each section under one page using `noWrap`
                for concise blocks.
              </Text>
              <Text variant="xs" color="mutedForeground" noMargin>
                Best practice: pass explicit row keys/owners to avoid ambiguous
                reporting handoffs.
              </Text>
            </Stack>
          </Section>

          <PageFooter
            variant="three-column"
            leftText="Confidential — Internal Use"
            centerText="Generated with PDFx"
            rightText="Page 1 of 1"
            sticky
            pagePadding={theme.spacing.page.marginLeft}
          />
        </View>
      </Page>
    </Document>
  );
};

export const ReportTemplateFrame = ({
  theme,
  data,
  titlePrefix,
  statusLabel,
  statusTone,
  graphVariant,
  graphTitle,
  graphSubtitle,
  graphLegend,
  graphShowValues,
  graphColors,
  graphData,
}: ReportTemplateProps & {
  titlePrefix: string;
  statusLabel: string;
  statusTone: "success" | "warning" | "destructive" | "info";
  graphVariant: ReportGraphVariant;
  graphTitle: string;
  graphSubtitle: string;
  graphLegend?: "bottom" | "right" | "none";
  graphShowValues?: boolean;
  graphColors?: string[];
  graphData?: { label: string; value: number }[];
}) => {
  if (!data) {
    return null;
  }

  return (
    <PdfcnThemeProvider theme={theme}>
      <ReportLayout
        data={data}
        titlePrefix={titlePrefix}
        statusLabel={statusLabel}
        statusTone={statusTone}
        graphVariant={graphVariant}
        graphTitle={graphTitle}
        graphSubtitle={graphSubtitle}
        graphLegend={graphLegend}
        graphShowValues={graphShowValues}
        graphColors={graphColors}
        graphData={graphData}
      />
    </PdfcnThemeProvider>
  );
};
