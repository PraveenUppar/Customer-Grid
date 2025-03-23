"use client";

import Header from "@/app/(components)/Header";
import {
	TrendingUp,
	Users,
	ShoppingBag,
	DollarSign,
	ArrowUp,
	ArrowDown,
	Filter,
	Download,
	Calendar,
	RefreshCw,
	PieChart as PieChartIcon,
} from "lucide-react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
} from "recharts";
import { useState, useMemo } from "react";

// Types
interface AnalyticsData {
	sales: {
		daily: number;
		weekly: number;
		monthly: number;
		yearlyGrowth: number;
	};
	customers: {
		total: number;
		active: number;
		new: number;
		churnRate: number;
	};
	products: {
		total: number;
		outOfStock: number;
		lowStock: number;
		topSelling: Array<{
			id: string;
			name: string;
			sales: number;
			revenue: number;
		}>;
	};
	rewards: {
		active: number;
		redemptionRate: number;
		averageDiscount: number;
		totalSavings: number;
	};
	feedback: {
		total: number;
		positiveRate: number;
		responseRate: number;
		averageRating: number;
	};
	performance: {
		revenue: number[];
		orders: number[];
		customers: number[];
		dates: string[];
	};
}

// Mock data generator
const generateMockAnalytics = (): AnalyticsData => {
	const generateDailyData = (days: number) => {
		return Array.from({ length: days }, (_, i) => ({
			revenue: Math.floor(Math.random() * 10000) + 5000,
			orders: Math.floor(Math.random() * 100) + 50,
			customers: Math.floor(Math.random() * 50) + 20,
			date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000)
				.toISOString()
				.split("T")[0],
		}));
	};

	const dailyData = generateDailyData(30);

	return {
		sales: {
			daily: Math.floor(Math.random() * 5000) + 2000,
			weekly: Math.floor(Math.random() * 25000) + 15000,
			monthly: Math.floor(Math.random() * 100000) + 50000,
			yearlyGrowth: Math.floor(Math.random() * 30) + 10,
		},
		customers: {
			total: Math.floor(Math.random() * 10000) + 5000,
			active: Math.floor(Math.random() * 5000) + 2000,
			new: Math.floor(Math.random() * 100) + 50,
			churnRate: Math.random() * 5 + 1,
		},
		products: {
			total: Math.floor(Math.random() * 1000) + 500,
			outOfStock: Math.floor(Math.random() * 50),
			lowStock: Math.floor(Math.random() * 100),
			topSelling: Array.from({ length: 5 }, (_, i) => ({
				id: `PROD-${i + 1}`,
				name: `Product ${i + 1}`,
				sales: Math.floor(Math.random() * 1000) + 500,
				revenue: Math.floor(Math.random() * 50000) + 25000,
			})),
		},
		rewards: {
			active: Math.floor(Math.random() * 50) + 20,
			redemptionRate: Math.random() * 30 + 40,
			averageDiscount: Math.random() * 15 + 10,
			totalSavings: Math.floor(Math.random() * 50000) + 25000,
		},
		feedback: {
			total: Math.floor(Math.random() * 1000) + 500,
			positiveRate: Math.random() * 20 + 70,
			responseRate: Math.random() * 20 + 70,
			averageRating: Math.random() * 1 + 4,
		},
		performance: {
			revenue: dailyData.map((d) => d.revenue),
			orders: dailyData.map((d) => d.orders),
			customers: dailyData.map((d) => d.customers),
			dates: dailyData.map((d) => d.date),
		},
	};
};

// Components
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const MetricCard = ({ title, value, change, icon: Icon }: any) => (
	<div className="bg-white rounded-lg shadow p-6">
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm text-gray-500">{title}</p>
				<p className="text-2xl font-semibold mt-2">{value}</p>
				{change && (
					<div
						className={`flex items-center mt-2 ${
							change >= 0 ? "text-green-500" : "text-red-500"
						}`}
					>
						{change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
						<span className="ml-1">{Math.abs(change)}%</span>
					</div>
				)}
			</div>
			<div className="p-3 bg-blue-100 rounded-full text-blue-600">
				<Icon size={24} />
			</div>
		</div>
	</div>
);

const PerformanceChart = ({ data }: { data: AnalyticsData["performance"] }) => (
	<div className="bg-white rounded-lg shadow p-6">
		<h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
		<ResponsiveContainer width="100%" height={300}>
			<AreaChart
				data={data.dates.map((date, i) => ({
					date,
					revenue: data.revenue[i],
					orders: data.orders[i],
					customers: data.customers[i],
				}))}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="date" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Area
					type="monotone"
					dataKey="revenue"
					stroke="#8884d8"
					fill="#8884d8"
				/>
				<Area
					type="monotone"
					dataKey="orders"
					stroke="#82ca9d"
					fill="#82ca9d"
				/>
				<Area
					type="monotone"
					dataKey="customers"
					stroke="#ffc658"
					fill="#ffc658"
				/>
			</AreaChart>
		</ResponsiveContainer>
	</div>
);

const ProductPerformance = ({
	products,
}: {
	products: AnalyticsData["products"]["topSelling"];
}) => (
	<div className="bg-white rounded-lg shadow p-6">
		<h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
		<ResponsiveContainer width="100%" height={300}>
			<BarChart data={products}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="sales" fill="#8884d8" />
				<Bar dataKey="revenue" fill="#82ca9d" />
			</BarChart>
		</ResponsiveContainer>
	</div>
);

const CustomerInsights = ({ data }: { data: AnalyticsData["customers"] }) => {
	const chartData = [
		{ name: "Active", value: data.active },
		{ name: "Inactive", value: data.total - data.active },
	];

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h3 className="text-lg font-semibold mb-4">Customer Insights</h3>
			<ResponsiveContainer width="100%" height={300}>
				<PieChart>
					<Pie
						data={chartData}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={({ name, percent }) =>
							`${name}: ${(percent * 100).toFixed(0)}%`
						}
						outerRadius={80}
						fill="#8884d8"
						dataKey="value"
					>
						{chartData.map((entry, index) => (
							<Cell
								key={`cell-${
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									index
								}`}
								fill={index === 0 ? "#8884d8" : "#82ca9d"}
							/>
						))}
					</Pie>
					<Tooltip />
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

const BusinessMetrics = ({ data }: { data: AnalyticsData }) => {
	const metrics = [
		{ name: "Sales Growth", value: data.sales.yearlyGrowth },
		{ name: "Customer Retention", value: 100 - data.customers.churnRate },
		{ name: "Reward Usage", value: data.rewards.redemptionRate },
		{ name: "Feedback Score", value: data.feedback.positiveRate },
	];

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h3 className="text-lg font-semibold mb-4">Business Metrics</h3>
			<ResponsiveContainer width="100%" height={300}>
				<RadarChart cx="50%" cy="50%" outerRadius="80%" data={metrics}>
					<PolarGrid />
					<PolarAngleAxis dataKey="name" />
					<PolarRadiusAxis angle={30} domain={[0, 100]} />
					<Radar
						name="Metrics"
						dataKey="value"
						stroke="#8884d8"
						fill="#8884d8"
						fillOpacity={0.6}
					/>
				</RadarChart>
			</ResponsiveContainer>
		</div>
	);
};

const AnalyticsDashboard = () => {
	const [timeRange, setTimeRange] = useState("30d");
	const data = useMemo(() => generateMockAnalytics(), []);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<Header name="Analytics Dashboard" />
				<div className="flex gap-3">
					<select
						className="px-4 py-2 bg-white rounded-md shadow"
						value={timeRange}
						onChange={(e) => setTimeRange(e.target.value)}
					>
						<option value="7d">Last 7 days</option>
						<option value="30d">Last 30 days</option>
						<option value="90d">Last 90 days</option>
					</select>
					<button
						type="button"
						className="px-4 py-2 bg-white rounded-md shadow flex items-center gap-2"
					>
						<Filter className="w-4 h-4" />
						Filters
					</button>
					<button
						type="button"
						className="px-4 py-2 bg-blue-500 text-white rounded-md shadow flex items-center gap-2"
					>
						<Download className="w-4 h-4" />
						Export
					</button>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<MetricCard
					title="Total Revenue"
					value={`$${data.sales.monthly.toLocaleString()}`}
					change={8.4}
					icon={DollarSign}
				/>
				<MetricCard
					title="Total Customers"
					value={data.customers.total.toLocaleString()}
					change={5.2}
					icon={Users}
				/>
				<MetricCard
					title="Total Products"
					value={data.products.total.toLocaleString()}
					change={-2.1}
					icon={ShoppingBag}
				/>
				<MetricCard
					title="Growth Rate"
					value={`${data.sales.yearlyGrowth}%`}
					change={3.8}
					icon={TrendingUp}
				/>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<PerformanceChart data={data.performance} />
				<ProductPerformance products={data.products.topSelling} />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<CustomerInsights data={data.customers} />
				<BusinessMetrics data={data} />
			</div>

			{/* Additional Metrics Table */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<div className="p-6">
					<h3 className="text-lg font-semibold">Detailed Metrics</h3>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Metric
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Value
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Change
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{/* Add your table rows here */}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsDashboard;
