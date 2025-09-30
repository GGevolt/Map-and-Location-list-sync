import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { List } from "react-window"
import { Search, MapPin, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import originalData from "@data/location.json"
import { useDispatch, useSelector } from "react-redux"
import { updateGoTo, updateLocations, updateSelectedIndex } from "@/store/locationSlice"
import { useListRef } from "react-window";

const LocationItem = ({ index, style, filteredAndSortedLocations, hanldeLocationClick, selectedIdx }) => {
    const location = filteredAndSortedLocations[index]
    return (
        <div style={style} className="px-3 py-1">
            <Card
                onClick={() => hanldeLocationClick(index, location.location)}
                className={`p-3 cursor-pointer transition-colors ${selectedIdx != null && selectedIdx === index ? "bg-[#0BE50B] text-white" : "bg-white"}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <h3 className="font-medium text-sm  max-w-45">{location.name}</h3>
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{location.rating}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export function LocationSidebar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const count = useRef(0);
    const data = useSelector((state) => state.locations)
    const dispatch = useDispatch();
    const listRef = useListRef(null);

    useEffect(() => {
        count.current++;
    }, [searchQuery, sortBy]);

    useEffect(() => {
        if (data.selectedIndex != null) {
            const list = listRef.current;
            list?.scrollToRow({
                align: "smart",
                behavior: "smooth",
                index: data.selectedIndex,
            });
        }
    }, [data.selectedIndex, listRef]);

    function removeVietnameseTones(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    }

    const filteredAndSortedLocations = useMemo(() => {
        const dataCopy = originalData.slice();
        const filtered = searchQuery.trim().length === 0 ? dataCopy : dataCopy.filter(
            (location) =>
                removeVietnameseTones(location.name).toLowerCase().includes(removeVietnameseTones(searchQuery).trim().toLowerCase()),
        )

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "rating-high":
                    return b.rating - a.rating
                case "rating-low":
                    return a.rating - b.rating
                case "name":
                default:
                    return removeVietnameseTones(a.name).localeCompare(removeVietnameseTones(b.name))
            }
        })

        return filtered
    }, [searchQuery, sortBy])

    useEffect(() => {
        dispatch(updateLocations(filteredAndSortedLocations));
        dispatch(updateSelectedIndex(null));
    }, [dispatch, filteredAndSortedLocations])

    const hanldeLocationClick = useCallback((index, location) => {
        if (data.selectedIndex === index)
            dispatch(updateSelectedIndex(null));
        else (
            dispatch(updateSelectedIndex(index)),
            dispatch(updateGoTo(
                {
                    latitude: location.lat,
                    longitude: location.lng
                }
            ))
        )
    }, [data.selectedIndex, dispatch]);

    function rowHeight(index, { filteredAndSortedLocations }) {
        if (filteredAndSortedLocations[index].name.length >= 26)
            return 80;
        else if (filteredAndSortedLocations[index].name.length >= 47)
            return 100;
        return 60;
    }
    return (
        <Sidebar className="w-full sm:w-80 md:w-80 lg:w-80 border-r">

            <SidebarHeader className="p-4 border-b">
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="p-3">
                        <p className="text-xs text-muted-foreground text-center">
                            {filteredAndSortedLocations.length} location{filteredAndSortedLocations.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>

                        <SelectContent className="">
                            <SelectItem value="name" className="">
                                Name (A-Z)
                            </SelectItem>
                            <SelectItem value="rating-high" className="">
                                Rating (High to Low)
                            </SelectItem>
                            <SelectItem value="rating-low" className="">
                                Rating (Low to High)
                            </SelectItem>
                        </SelectContent>
                    </Select>

                </div>
            </SidebarHeader>

            <SidebarContent className="p-0">
                <div className="h-full">
                    <List
                        listRef={listRef}
                        key={count.current}
                        rowComponent={LocationItem}
                        rowCount={filteredAndSortedLocations.length}
                        rowHeight={rowHeight}
                        // @ts-ignore
                        rowProps={{ filteredAndSortedLocations, hanldeLocationClick, selectedIdx: data.selectedIndex }}
                        className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                    />
                </div>
            </SidebarContent>
        </Sidebar>
    )
}