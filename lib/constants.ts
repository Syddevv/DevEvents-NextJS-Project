export interface Event {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
    title: "Google I/O 2026",
    image: "/images/event1.png",
    slug: "google-io-2026",
    location: "Mountain View, CA, USA",
    date: "2026-05-20",
    time: "09:00 AM",
  },
  {
    title: "Microsoft Build 2026",
    image: "/images/event2.png",
    slug: "microsoft-build-2026",
    location: "Seattle, WA, USA",
    date: "2026-05-26",
    time: "10:00 AM",
  },
  {
    title: "WWDC 2026",
    image: "/images/event3.png",
    slug: "wwdc-2026",
    location: "San Jose, CA, USA",
    date: "2026-06-08",
    time: "10:00 AM",
  },
  {
    title: "KubeCon + CloudNativeCon Europe 2026",
    image: "/images/event4.png",
    slug: "kubecon-eu-2026",
    location: "Paris, France",
    date: "2026-04-07",
    time: "08:30 AM",
  },
  {
    title: "React Conf 2026",
    image: "/images/event5.png",
    slug: "react-conf-2026",
    location: "Las Vegas, NV, USA",
    date: "2026-10-15",
    time: "09:30 AM",
  },
  {
    title: "HackMIT 2026",
    image: "/images/event6.png",
    slug: "hackmit-2026",
    location: "Cambridge, MA, USA",
    date: "2026-09-19",
    time: "05:00 PM",
  },
];