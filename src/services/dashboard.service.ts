import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/dashboard`;

// GET ALL TOTAL OVERVIEW
export const getAllTotalOverview = async () => {
  return await axiosAuth.get(`${baseUrl}/count-data`);
};

export const useGetAllTotalOverview = (enabled: boolean) => {
  return useQuery({
    queryKey: ["count-data"],
    queryFn: () => getAllTotalOverview().then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// GET ALL TOP USERS AND ORDERS
export const getAllTopUsersAndOrders = async (filter: string) => {
  return await axiosAuth.get(`${baseUrl}/top-data?filter=${filter}`);
};

export const useGetAllTopUsersAndOrders = (
  filter: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["top-users-and-orders", filter],
    queryFn: () =>
      getAllTopUsersAndOrders(filter).then((res) => res?.data?.data),
    enabled: enabled,
  });
};





// GET ALL TOP USERS AND USER
export const getchartData = async (queryParams: any) => {
  return await axiosAuth.get(`${baseUrl}/time-line-data`, {
    params: {
      ...queryParams
    }
  });
};

export const usegetchartData = (

  enabled: boolean = true,
  queryparams: any
) => {
  return useQuery({
    queryKey: ["chart-data", queryparams],
    queryFn: () =>
      getchartData(queryparams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};




// GET ALL TOP USERS AND ORDERS
export const getchartDataOrder = async (queryParams: any) => {
  return await axiosAuth.get(`${baseUrl}/time-line-data-order`, {
    params: {
      ...queryParams
    }
  });
};

export const usegetchartDataOrder = (

  enabled: boolean = true,
  queryparams: any
) => {
  return useQuery({
    queryKey: ["chart-data-order", queryparams],
    queryFn: () =>
      getchartDataOrder(queryparams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};


// GET REVENUE DATA



export const getDataRevenue = async () => {
  return await axiosAuth.get(`${baseUrl}/revenue-data`);
};

export const usegetDataRevenue = (

  enabled: boolean = true,

) => {
  return useQuery({
    queryKey: ["revenue-data",],
    queryFn: () =>
      getDataRevenue().then((res) => res?.data?.data),
    enabled: enabled,
  });
};




export const getDataSubcriptionDataRole = async (queryParams?:any) => {
  return await axiosAuth.get(`${baseUrl}/subscription-data`,{
    params:{
      ...queryParams
    }
  });
};

export const usegetDataSubcriptionDataRole = (

  enabled: boolean = true,
  queryParams:any

) => {
  return useQuery({
    queryKey: ["sub-data-role",queryParams],
    queryFn: () =>
      getDataSubcriptionDataRole(queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};






export const getDataSubcriptionDataRoleChart = async (queryParams?:any) => {
  return await axiosAuth.get(`${baseUrl}/revenue-data-role-graphical`,{
    params:{
      ...queryParams
    }
  });
};

export const usegetDataSubcriptionDataRoleChart = (

  enabled: boolean = true,
  queryParams:any

) => {
  return useQuery({
    queryKey: ["sub-data-role-chart",queryParams],
    queryFn: () =>
      getDataSubcriptionDataRoleChart(queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};




type FilterType = "day" | "week" | "month" | "year";
type ChartType = "user" | "order";

interface TimelineItem {
  period: number;
  approved?: number;
  rejected?: number;
  pending?: number;
  completed?: number;
}

export const convertTimelineToApexSeries = (
  timeline: TimelineItem[] = [],
  filter: any,
  type: ChartType,
  role?: any
) => {

  let length = 0;
  console.log("fil", filter)

  switch (filter) {
    case "day":
      length = 24;
      break;
    case "week":
      length = 4;
      break;
    case "month":
      length = 12;
      break;
    case "year":
      length = timeline.length;
      break;
  }

  /* ================= USER CHART ================= */
  if (type === "user") {

    const approved = Array(length).fill(0);
    const rejected = Array(length).fill(0);
    const pending = Array(length).fill(0);

    timeline?.forEach(item => {

      const index =
        filter === "day" ? item.period :
          filter === "week" ? item.period - 1 :
            filter === "month" ? item.period - 1 :
              timeline.findIndex(t => t.period === item.period);

      if (index >= 0 && index < length) {
        approved[index] = item.approved ?? 0;
        rejected[index] = item.rejected ?? 0;
        pending[index] = item.pending ?? 0;
      }
    });


    if (role === "retailer") {

      return [
        { name: "Verified Retailer", data: approved },
        { name: "Rejected Retailer", data: rejected },
        { name: "Verification Pending Retailer", data: pending }
      ];
    } else if (role === "agent") {
      return [
        { name: "Verified Sales executive", data: approved },
        { name: "Rejected Sales executive", data: rejected },
        { name: "Verification Pending Sales executive", data: pending }
      ];
    }

    return [
      { name: "Verified Vendors", data: approved },
      { name: "Rejected Vendors", data: rejected },
      { name: "Verification Pending Vendors", data: pending }
    ];
  }

  /* ================= ORDER CHART ================= */

  const completed = Array(length).fill(0);
  const pendingOrders = Array(length).fill(0);

  timeline.forEach(item => {

    const index =
      filter === "day" ? item.period :
        filter === "week" ? item.period - 1 :
          filter === "month" ? item.period - 1 :
            timeline.findIndex(t => t.period === item.period);

    if (index >= 0 && index < length) {
      completed[index] = item.completed ?? 0;
      pendingOrders[index] = item.pending ?? 0;
    }
  });

  return [
    { name: "Completed Orders", data: completed },
    { name: "Pending Orders", data: pendingOrders }
  ];
};










// sub



// type FilterType = "day" | "week" | "month" | "year";

type SubscriptionTimelineItem = {
  period: number; // day:0-23, week:1-4, month:1-12, year:YYYY
  total?: number;
  // dynamic: standard?: number; corporate?: number; ...
  [planKey: string]: any;
};

export const convertSubscriptionTimelineToApexSeries = (
  timeline: SubscriptionTimelineItem[] = [],
  filter: any,
  includeTotal: boolean = false
) => {
  let length = 0;

  switch (filter) {
    case "day":
      length = 24;
      break;
    case "week":
      length = 4;
      break;
    case "month":
      length = 12;
      break;
    case "year":
      // last 5 years in your API => use timeline length (already filled)
      length = timeline.length;
      break;
    default:
      length = timeline.length;
  }

  // ✅ collect all plan keys dynamically (ignore period & total)
  const planKeys = Array.from(
    new Set(
      timeline.flatMap((item) =>
        Object.keys(item).filter((k) => k !== "period" && k !== "total")
      )
    )
  );

  // ✅ create data arrays for each plan
  const seriesMap: Record<string, number[]> = {};
  planKeys.forEach((k) => (seriesMap[k] = Array(length).fill(0)));

  const totalArr = Array(length).fill(0);

  timeline.forEach((item) => {
    const index =
      filter === "day"
        ? Number(item.period) // 0..23
        : filter === "week"
        ? Number(item.period) - 1 // 1..4
        : filter === "month"
        ? Number(item.period) - 1 // 1..12
        : timeline.findIndex((t) => t.period === item.period); // year: by match

    if (index >= 0 && index < length) {
      for (const key of planKeys) {
        seriesMap[key][index] = Number(item[key] ?? 0);
      }
      totalArr[index] = Number(item.total ?? 0);
    }
  });

  // ✅ build apex series array
  const series = planKeys.map((key) => ({
    name: formatPlanName(key),
    data: seriesMap[key],
  }));

  if (includeTotal) {
    series.push({ name: "Total", data: totalArr });
  }

  return series;
};

// helper: "standard" -> "Standard Subscriptions", "corporate_plan" -> "Corporate Plan Subscriptions"
const formatPlanName = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) + " Subscriptions";
