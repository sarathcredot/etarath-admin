export const PLANS = {
  EXECUTIVE: "executive_plan",
  CORPORATE: "corporate_plan",
} as const;
export type PLANS_TYPE = typeof PLANS[keyof typeof PLANS];
export type PLANS_KEY_TYPE = keyof typeof PLANS;

export const ORDER_TYPES = {
  AUCTION_PLAN: "auction_plan",
  POSTER_PLAN: "poster_plan",
} as const 

export const TEMPLATE_TYPES = {
  TOURNAMENT_ANNOUNCEMENT: "tournament_announcement",
  TEAM_REGISTRATION: "team_registration",
  TEAM_POSTER: "teams_poster",
  CHAMPIONS: "champions",
  RUNNER_UP: "runners_up",
  MOTM: "each_game_mom",
  POT: "each_game_pot",
  PLAYER_REGISTRATION: "player_registration",
  AUCTION_ANNOUNCEMENT: "auction_announcement",
  MATCH_DAY_ANNOUNCEMENT: "match_day_announcement"
} as const

