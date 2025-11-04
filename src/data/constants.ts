/**
 * Application-wide constants
 * Centralized location for thresholds, limits, and configuration values
 */

/**
 * Score thresholds for categorization
 */
export const SCORE_THRESHOLDS = {
  HIGH: 60,
  MEDIUM: 40,
  LOW: 0,
} as const;

/**
 * Enterprise readiness thresholds
 */
export const ENTERPRISE_THRESHOLDS = {
  READY: 30,
  DEVELOPING: 20,
  STARTING: 0,
} as const;

/**
 * Health score thresholds for categorization
 */
export const HEALTH_THRESHOLDS = {
  EXCELLENT: 65,
  GOOD: 60,
  FAIR: 50,
} as const;

/**
 * Display limits for various components
 */
export const DISPLAY_LIMITS = {
  TOP_LANGUAGES: 5,
  ENTERPRISE_LEADERS: 6,
  TOP_REPOSITORIES: 10,
  SEARCH_RESULTS: 20,
} as const;

/**
 * Score weights for overall calculation
 * 
 * @remarks
 * These values are for REFERENCE ONLY and document the methodology
 * used in the Jupyter notebooks to calculate the overall scores.
 * The actual overall scores in the data are pre-calculated and
 * these constants are NOT used in runtime calculations.
 * 
 * Overall Score = (Popularity × 0.4) + (Activity × 0.35) + (Health × 0.25)
 */
export const SCORE_WEIGHTS = {
  POPULARITY: 0.4,
  ACTIVITY: 0.35,
  HEALTH: 0.25,
} as const;

/**
 * Color palette for data visualization
 */
export const CHART_COLORS = {
  PRIMARY: '#58a6ff',
  SUCCESS: '#3fb950',
  WARNING: '#f0883e',
  DANGER: '#f85149',
  INFO: '#bc8cff',
  NEUTRAL: '#8b949e',
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * Statistical significance thresholds
 */
export const STATS_THRESHOLDS = {
  CORRELATION_STRONG: 0.7,
  CORRELATION_MODERATE: 0.5,
  CORRELATION_WEAK: 0.3,
  P_VALUE_SIGNIFICANT: 0.05,
} as const;
