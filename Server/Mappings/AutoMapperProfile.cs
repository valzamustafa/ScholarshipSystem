using AutoMapper;
using Server.DTOs;
using Server.Entities;

namespace Server.Mappings 
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
         
            CreateMap<ContactMessageDto, ContactMessage>().ReverseMap();

           
        }
    }
}
