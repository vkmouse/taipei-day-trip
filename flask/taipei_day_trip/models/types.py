from datetime import datetime
import typing

List = typing.List


class Attraction:
    def __init__(
        self,
        id: int,
        name: str,
        description: str,
        address: str,
        lat: float,
        lng: float,
        transport: str,
        images: List[str],
        category: str,
        mrt: str,
    ):
        self.id = id
        self.name = name
        self.description = description
        self.address = address
        self.lat = lat
        self.lng = lng
        self.transport = transport
        self.images = images
        self.category = category
        self.mrt = mrt

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "address": self.address,
            "transport": self.transport,
            "mrt": self.mrt,
            "lat": self.lat,
            "lng": self.lng,
            "images": self.images,
        }


class Booking:
    def __init__(
        self,
        id: int,
        member_id: int,
        attraction: Attraction,
        starttime: datetime,
        endtime: datetime,
        price: int,
        has_paid: bool,
    ):
        self.id = id
        self.member_id = member_id
        self.attraction = attraction
        self.starttime = starttime
        self.endtime = endtime
        self.price = price
        self.has_paid = has_paid


class Category:
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name


class Member:
    def __init__(self, id: int, name: str, email: str, password: str, avatar_url: str):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.avatar_url = avatar_url


class MRT:
    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name


class Order:
    def __init__(
        self,
        id: int,
        member_id: int,
        price: int,
        bookings: List[Booking],
        payment_status: int,
        contact_name: str,
        contact_email: str,
        contact_phone: str,
        created_at: datetime,
    ):
        self.id = id
        self.member_id = member_id
        self.price = price
        self.bookings = bookings
        self.payment_status = payment_status
        self.contact_name = contact_name
        self.contact_email = contact_email
        self.contact_phone = contact_phone
        self.created_at = created_at

    def to_json(self):
        return {
            "orderId": self.id,
            "price": self.price,
            "status": self.payment_status,
            "trip": list(
                map(
                    lambda x: {
                        "attraction": {
                            "id": x.attraction.id,
                            "name": x.attraction.name,
                            "address": x.attraction.address,
                            "image": x.attraction.images[0],
                        },
                        "starttime": x.starttime.strftime("%Y-%m-%d %H:%M:%S"),
                        "endtime": x.endtime.strftime("%Y-%m-%d %H:%M:%S"),
                    },
                    self.bookings,
                )
            ),
            "contact": {
                "name": self.contact_name,
                "email": self.contact_email,
                "phone": self.contact_phone,
            },
        }
